import { useEffect, useMemo, useState } from 'react';
import { conversations as initialConversations } from '../data/messages';
import ChatWindow from '../components/ChatWindow';

function Messages() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState(initialConversations[0]?.id ?? null);
  const [draftMessage, setDraftMessage] = useState('');

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === selectedId),
    [conversations, selectedId]
  );

  const handleSend = () => {
    const content = draftMessage.trim();
    if (!content || !selectedConversation) return;

    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== selectedId) return conversation;
        return {
          ...conversation,
          messages: [...conversation.messages, { id: Date.now(), sender: 'user', text: content }],
        };
      })
    );
    setDraftMessage('');
  };

  useEffect(() => {
    if (!selectedConversation) return;

    const lastMessage = selectedConversation.messages[selectedConversation.messages.length - 1];
    if (!lastMessage || lastMessage.sender !== 'user') return;

    const timeoutId = setTimeout(() => {
      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation.id !== selectedId) return conversation;
          return {
            ...conversation,
            messages: [
              ...conversation.messages,
              {
                id: Date.now() + 1,
                sender: 'staff',
                text: 'Thanks for your message. A shelter team member will follow up soon.',
              },
            ],
          };
        })
      );
    }, 900);

    return () => clearTimeout(timeoutId);
  }, [conversations, selectedConversation, selectedId]);

  return (
    <div className="container page-content">
      <section className="page-header-block">
        <p className="eyebrow">Communicating</p>
        <h2>Messages</h2>
        <p>Ask questions and keep your conversation with the shelter team in one place.</p>
      </section>

      <section className="messages-layout">
        <aside className="conversation-list card">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              className={conversation.id === selectedId ? 'conversation-item active' : 'conversation-item'}
              onClick={() => setSelectedId(conversation.id)}
            >
              <strong>{conversation.title}</strong>
              <span>{conversation.participant}</span>
            </button>
          ))}
        </aside>

        <ChatWindow
          conversation={selectedConversation}
          draftMessage={draftMessage}
          setDraftMessage={setDraftMessage}
          onSend={handleSend}
        />
      </section>
    </div>
  );
}

export default Messages;
