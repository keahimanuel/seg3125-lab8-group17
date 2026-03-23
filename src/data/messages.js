export const conversations = [
  {
    id: 1,
    petId: 'bella',
    title: 'Bella adoption questions',
    participant: 'Shelter Team',
    messages: [
      { id: 1, sender: 'staff', text: 'Hi! Thanks for your interest in Bella. How can we help?' },
      { id: 2, sender: 'user', text: 'I wanted to know if she is okay with kids.' },
      { id: 3, sender: 'staff', text: 'Yes, Bella does best with respectful older children.' },
    ],
  },
  {
    id: 2,
    petId: 'milo',
    title: 'Milo availability',
    participant: 'Foster Coordinator',
    messages: [
      { id: 1, sender: 'staff', text: 'Milo is still available and accepting applications.' },
      { id: 2, sender: 'user', text: 'Perfect, thank you. I would love to meet him.' },
    ],
  },
];
