const BASE = 'http://localhost:3001';

// ── Normalizers ───────────────────────────────────────────────────────────────

function formatAge(age) {
  if (age === 0) return 'under 1 year';
  return age === 1 ? '1 year' : `${age} years`;
}

function normalizePet(pet) {
  return {
    ...pet,
    id: pet.pet_id,
    image: pet.image_url || '',
    age: formatAge(pet.age),
    temperament: pet.temperament ? pet.temperament.split(', ') : [],
    medicalHistory: pet.medical_summary || '',
    careGuide: [pet.feeding_info, pet.exercise_info, pet.grooming_info, pet.health_info]
      .filter(Boolean)
      .join('\n\n') || '',
    description: pet.temperament || '',
  };
}

function normalizeConversation(conv) {
  return {
    ...conv,
    id: conv.conversation_id,
    title: conv.topic,
    participant: conv.staff_name || 'Shelter Team',
    messages: [],
  };
}

function normalizeMessage(msg) {
  return {
    ...msg,
    id: msg.message_id,
    sender: msg.sender_type,
    text: msg.message_text,
  };
}

// ── Pets ──────────────────────────────────────────────────────────────────────

export async function fetchPets() {
  const res = await fetch(`${BASE}/api/pets`);
  const data = await res.json();
  return data.map(normalizePet);
}

export async function fetchPet(id) {
  const res = await fetch(`${BASE}/api/pets/${id}`);
  if (!res.ok) return null;
  return normalizePet(await res.json());
}

// ── Care Guides ───────────────────────────────────────────────────────────────

export async function fetchCareGuides() {
  const res = await fetch(`${BASE}/api/care-guides`);
  return res.json();
}

// ── Adoption Applications ────────────────────────────────────────────────────

export async function postApplication(data) {
  const res = await fetch(`${BASE}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ── Conversations & Messages ──────────────────────────────────────────────────

export async function fetchConversations() {
  const res = await fetch(`${BASE}/api/conversations`);
  const data = await res.json();
  return data.map(normalizeConversation);
}

export async function fetchMessages(conversationId) {
  const res = await fetch(`${BASE}/api/conversations/${conversationId}/messages`);
  const data = await res.json();
  return data.map(normalizeMessage);
}

export async function postMessage(data) {
  const res = await fetch(`${BASE}/api/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
