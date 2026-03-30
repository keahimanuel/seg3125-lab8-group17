const express = require('express');
const cors    = require('cors');
const db      = require('./db');

const app  = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// ── Pets ──────────────────────────────────────────────────────────────────────

app.get('/api/pets', (req, res) => {
  const pets = db.prepare(`
    SELECT p.*, pi.image_url, pi.alt_text
    FROM Pets p
    LEFT JOIN PetImages pi ON pi.pet_id = p.pet_id AND pi.display_order = 1
  `).all();
  res.json(pets);
});

app.get('/api/pets/:id', (req, res) => {
  const pet = db.prepare(`
    SELECT p.*, pi.image_url, pi.alt_text,
           cg.feeding_info, cg.exercise_info, cg.grooming_info, cg.health_info
    FROM Pets p
    LEFT JOIN PetImages pi ON pi.pet_id = p.pet_id AND pi.display_order = 1
    LEFT JOIN CareGuides cg ON cg.care_guide_id = p.care_guide_id
    WHERE p.pet_id = ?
  `).get(req.params.id);
  if (!pet) return res.status(404).json({ error: 'Pet not found' });
  res.json(pet);
});

app.get('/api/pets/:id/images', (req, res) => {
  const images = db.prepare(
    'SELECT * FROM PetImages WHERE pet_id = ? ORDER BY display_order'
  ).all(req.params.id);
  res.json(images);
});

// ── Care Guides ───────────────────────────────────────────────────────────────

app.get('/api/care-guides', (req, res) => {
  res.json(db.prepare('SELECT * FROM CareGuides').all());
});

app.get('/api/care-guides/:id', (req, res) => {
  const guide = db.prepare('SELECT * FROM CareGuides WHERE care_guide_id = ?').get(req.params.id);
  if (!guide) return res.status(404).json({ error: 'Care guide not found' });
  res.json(guide);
});

// ── Users ─────────────────────────────────────────────────────────────────────

app.get('/api/users/:id', (req, res) => {
  const user = db.prepare(
    'SELECT user_id, first_name, last_name, email, phone, city, province, created_at FROM Users WHERE user_id = ?'
  ).get(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const { first_name, last_name, email, phone, password_hash, address, city, province, postal_code } = req.body;
  try {
    const result = db.prepare(`
      INSERT INTO Users (first_name, last_name, email, phone, password_hash, address, city, province, postal_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(first_name, last_name, email, phone, password_hash, address, city, province, postal_code);
    res.status(201).json({ user_id: result.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ── Staff ─────────────────────────────────────────────────────────────────────

app.get('/api/staff', (req, res) => {
  const staff = db.prepare(
    'SELECT staff_id, first_name, last_name, email, phone, role, created_at FROM Staff'
  ).all();
  res.json(staff);
});

// ── Adoption Applications ────────────────────────────────────────────────────

app.get('/api/applications', (req, res) => {
  res.json(db.prepare('SELECT * FROM AdoptionApplications').all());
});

app.get('/api/applications/:id', (req, res) => {
  const app_ = db.prepare('SELECT * FROM AdoptionApplications WHERE application_id = ?').get(req.params.id);
  if (!app_) return res.status(404).json({ error: 'Application not found' });
  res.json(app_);
});

app.post('/api/applications', (req, res) => {
  const {
    user_id, pet_id, status = 'submitted', housing_type,
    has_yard = 0, household_size, has_other_pets = 0,
    experience_with_pets, notes,
  } = req.body;
  const result = db.prepare(`
    INSERT INTO AdoptionApplications
      (user_id, pet_id, status, submitted_at, housing_type, has_yard, household_size, has_other_pets, experience_with_pets, notes)
    VALUES (?, ?, ?, datetime('now'), ?, ?, ?, ?, ?, ?)
  `).run(user_id, pet_id, status, housing_type, has_yard, household_size, has_other_pets, experience_with_pets, notes);
  res.status(201).json({ application_id: result.lastInsertRowid });
});

app.patch('/api/applications/:id/status', (req, res) => {
  const { status } = req.body;
  db.prepare('UPDATE AdoptionApplications SET status = ? WHERE application_id = ?')
    .run(status, req.params.id);
  res.json({ ok: true });
});

// ── Conversations ─────────────────────────────────────────────────────────────

app.get('/api/conversations', (req, res) => {
  const rows = db.prepare(`
    SELECT c.*, s.first_name || ' ' || s.last_name AS staff_name
    FROM Conversations c
    LEFT JOIN Staff s ON s.staff_id = c.staff_id
    ORDER BY c.updated_at DESC
  `).all();
  res.json(rows);
});

app.get('/api/conversations/:id', (req, res) => {
  const conv = db.prepare('SELECT * FROM Conversations WHERE conversation_id = ?').get(req.params.id);
  if (!conv) return res.status(404).json({ error: 'Conversation not found' });
  res.json(conv);
});

app.post('/api/conversations', (req, res) => {
  const { user_id, staff_id, pet_id, topic } = req.body;
  const result = db.prepare(`
    INSERT INTO Conversations (user_id, staff_id, pet_id, topic) VALUES (?, ?, ?, ?)
  `).run(user_id, staff_id ?? null, pet_id ?? null, topic);
  res.status(201).json({ conversation_id: result.lastInsertRowid });
});

// ── Messages ──────────────────────────────────────────────────────────────────

app.get('/api/conversations/:id/messages', (req, res) => {
  const messages = db.prepare(
    'SELECT * FROM Messages WHERE conversation_id = ? ORDER BY sent_at'
  ).all(req.params.id);
  res.json(messages);
});

app.post('/api/messages', (req, res) => {
  const { conversation_id, sender_type, sender_id, message_text } = req.body;
  const result = db.prepare(`
    INSERT INTO Messages (conversation_id, sender_type, sender_id, message_text)
    VALUES (?, ?, ?, ?)
  `).run(conversation_id, sender_type, sender_id, message_text);

  // Update conversation's updated_at
  db.prepare(`UPDATE Conversations SET updated_at = datetime('now') WHERE conversation_id = ?`)
    .run(conversation_id);

  res.status(201).json({ message_id: result.lastInsertRowid });
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`Paws & Home API running at http://localhost:${PORT}`);
});
