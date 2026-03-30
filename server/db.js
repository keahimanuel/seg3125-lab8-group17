const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'paws.db'));

// Enable foreign key enforcement
db.exec('PRAGMA foreign_keys = ON');

// ── Schema ────────────────────────────────────────────────────────────────────

db.exec(`
  CREATE TABLE IF NOT EXISTS CareGuides (
    care_guide_id INTEGER PRIMARY KEY AUTOINCREMENT,
    species       TEXT,
    title         TEXT,
    feeding_info  TEXT,
    exercise_info TEXT,
    grooming_info TEXT,
    health_info   TEXT
  );

  CREATE TABLE IF NOT EXISTS Users (
    user_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name    TEXT,
    last_name     TEXT,
    email         TEXT UNIQUE,
    phone         TEXT,
    password_hash TEXT,
    address       TEXT,
    city          TEXT,
    province      TEXT,
    postal_code   TEXT,
    created_at    TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS Staff (
    staff_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    first_name TEXT,
    last_name  TEXT,
    email      TEXT UNIQUE,
    phone      TEXT,
    role       TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS Pets (
    pet_id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name               TEXT,
    species            TEXT,
    breed              TEXT,
    age                INTEGER,
    gender             TEXT,
    size               TEXT,
    temperament        TEXT,
    special_needs      TEXT,
    vaccination_status TEXT,
    medical_summary    TEXT,
    status             TEXT,
    arrival_date       TEXT,
    featured           INTEGER DEFAULT 0,
    care_guide_id      INTEGER REFERENCES CareGuides(care_guide_id)
  );

  CREATE TABLE IF NOT EXISTS PetImages (
    image_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id        INTEGER REFERENCES Pets(pet_id),
    image_url     TEXT,
    alt_text      TEXT,
    display_order INTEGER
  );

  CREATE TABLE IF NOT EXISTS AdoptionApplications (
    application_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id              INTEGER REFERENCES Users(user_id),
    pet_id               INTEGER REFERENCES Pets(pet_id),
    status               TEXT DEFAULT 'draft',
    submitted_at         TEXT,
    housing_type         TEXT,
    has_yard             INTEGER DEFAULT 0,
    household_size       INTEGER,
    has_other_pets       INTEGER DEFAULT 0,
    experience_with_pets TEXT,
    notes                TEXT
  );

  CREATE TABLE IF NOT EXISTS Conversations (
    conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id         INTEGER REFERENCES Users(user_id),
    staff_id        INTEGER REFERENCES Staff(staff_id),
    pet_id          INTEGER REFERENCES Pets(pet_id),
    topic           TEXT,
    created_at      TEXT DEFAULT (datetime('now')),
    updated_at      TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS Messages (
    message_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER REFERENCES Conversations(conversation_id),
    sender_type     TEXT,
    sender_id       INTEGER,
    message_text    TEXT,
    sent_at         TEXT DEFAULT (datetime('now'))
  );
`);

// ── Seed ──────────────────────────────────────────────────────────────────────

const isEmpty = (table) =>
  db.prepare(`SELECT COUNT(*) as n FROM ${table}`).get().n === 0;

if (isEmpty('CareGuides')) {
  const insertGuide = db.prepare(`
    INSERT INTO CareGuides (species, title, feeding_info, exercise_info, grooming_info, health_info)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertGuide.run('Dog', 'Dog Care Guide',
    'Feed twice daily with age-appropriate kibble. Always provide fresh water.',
    'Requires at least 30–60 minutes of daily exercise depending on breed.',
    'Brush weekly; bathe monthly or as needed. Trim nails every 4–6 weeks.',
    'Schedule annual vet checkups and keep vaccinations current.');

  insertGuide.run('Cat', 'Cat Care Guide',
    'Feed measured portions twice daily. Provide fresh water at all times.',
    'Encourage play with wand toys and climbing structures for at least 15 minutes daily.',
    'Brush short-haired cats weekly. Clean litter box daily.',
    'Annual vet visits recommended; watch for changes in appetite or behaviour.');

  insertGuide.run('Rabbit', 'Rabbit Care Guide',
    'Unlimited timothy hay should make up 80% of diet. Supplement with leafy greens.',
    'Needs at least 3 hours of free-roam exercise per day in a safe space.',
    'Brush weekly; never bathe unless necessary. Trim nails monthly.',
    'Spay/neuter recommended. Annual vet visits and watch for GI stasis signs.');
}

if (isEmpty('Staff')) {
  db.prepare(`INSERT INTO Staff (first_name, last_name, email, phone, role) VALUES (?, ?, ?, ?, ?)`)
    .run('Shelter', 'Team', 'team@pawsandhome.ca', '613-555-0100', 'counselor');
  db.prepare(`INSERT INTO Staff (first_name, last_name, email, phone, role) VALUES (?, ?, ?, ?, ?)`)
    .run('Foster', 'Coordinator', 'foster@pawsandhome.ca', '613-555-0101', 'administrator');
}

if (isEmpty('Users')) {
  db.prepare(`
    INSERT INTO Users (first_name, last_name, email, phone, password_hash, city, province)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run('Demo', 'User', 'demo@example.com', '613-555-0200', 'hashed_password', 'Ottawa', 'Ontario');
}

if (isEmpty('Pets')) {
  const dogGuideId    = db.prepare(`SELECT care_guide_id FROM CareGuides WHERE species = 'Dog'`).get().care_guide_id;
  const catGuideId    = db.prepare(`SELECT care_guide_id FROM CareGuides WHERE species = 'Cat'`).get().care_guide_id;
  const rabbitGuideId = db.prepare(`SELECT care_guide_id FROM CareGuides WHERE species = 'Rabbit'`).get().care_guide_id;

  const insertPet = db.prepare(`
    INSERT INTO Pets (name, species, breed, age, gender, size, temperament,
                      vaccination_status, medical_summary, status, featured, care_guide_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const bellaId = insertPet.run(
    'Bella', 'Dog', 'Labrador Mix', 2, 'Female', 'Medium', 'Friendly, Energetic, Affectionate',
    'Up to date', 'Vaccinated, microchipped, spayed, and up to date on routine checkups.',
    'Available', 1, dogGuideId
  ).lastInsertRowid;

  const miloId = insertPet.run(
    'Milo', 'Cat', 'Domestic Shorthair', 1, 'Male', 'Small', 'Calm, Curious, Gentle',
    'Up to date', 'Vaccinated, neutered, litter trained, and healthy.',
    'Available', 1, catGuideId
  ).lastInsertRowid;

  const lunaId = insertPet.run(
    'Luna', 'Dog', 'Border Collie Mix', 3, 'Female', 'Large', 'Smart, Active, Loyal',
    'Up to date', 'Vaccinated, spayed, and currently on a joint-support supplement.',
    'Pending', 1, dogGuideId
  ).lastInsertRowid;

  const cocoId = insertPet.run(
    'Coco', 'Rabbit', 'Mini Lop', 0, 'Female', 'Small', 'Quiet, Sweet, Shy',
    'Health checked', 'Health checked and scheduled for spay consultation.',
    'Available', 1, rabbitGuideId
  ).lastInsertRowid;

  const insertImage = db.prepare(`
    INSERT INTO PetImages (pet_id, image_url, alt_text, display_order) VALUES (?, ?, ?, 1)
  `);

  insertImage.run(bellaId,
    'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80',
    'Bella the Labrador Mix');
  insertImage.run(miloId,
    'https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=900&q=80',
    'Milo the Domestic Shorthair');
  insertImage.run(lunaId,
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=900&q=80',
    'Luna the Border Collie Mix');
  insertImage.run(cocoId,
    'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=900&q=80',
    'Coco the Mini Lop');
}

if (isEmpty('Conversations')) {
  const userId  = db.prepare(`SELECT user_id  FROM Users WHERE email = 'demo@example.com'`).get().user_id;
  const staff1  = db.prepare(`SELECT staff_id FROM Staff WHERE email = 'team@pawsandhome.ca'`).get().staff_id;
  const staff2  = db.prepare(`SELECT staff_id FROM Staff WHERE email = 'foster@pawsandhome.ca'`).get().staff_id;
  const bellaId = db.prepare(`SELECT pet_id   FROM Pets  WHERE name  = 'Bella'`).get().pet_id;
  const miloId  = db.prepare(`SELECT pet_id   FROM Pets  WHERE name  = 'Milo'`).get().pet_id;

  const conv1Id = db.prepare(`INSERT INTO Conversations (user_id, staff_id, pet_id, topic) VALUES (?, ?, ?, ?)`)
    .run(userId, staff1, bellaId, 'Bella adoption questions').lastInsertRowid;
  const conv2Id = db.prepare(`INSERT INTO Conversations (user_id, staff_id, pet_id, topic) VALUES (?, ?, ?, ?)`)
    .run(userId, staff2, miloId, 'Milo availability').lastInsertRowid;

  const insertMsg = db.prepare(`
    INSERT INTO Messages (conversation_id, sender_type, sender_id, message_text) VALUES (?, ?, ?, ?)
  `);

  insertMsg.run(conv1Id, 'staff', staff1, 'Hi! Thanks for your interest in Bella. How can we help?');
  insertMsg.run(conv1Id, 'user',  userId, 'I wanted to know if she is okay with kids.');
  insertMsg.run(conv1Id, 'staff', staff1, 'Yes, Bella does best with respectful older children.');

  insertMsg.run(conv2Id, 'staff', staff2, 'Milo is still available and accepting applications.');
  insertMsg.run(conv2Id, 'user',  userId, 'Perfect, thank you. I would love to meet him.');
}

module.exports = db;
