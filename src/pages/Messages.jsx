import { useEffect, useState } from 'react';
import { fetchConversations, fetchMessages, postMessage } from '../api';
import ChatWindow from '../components/ChatWindow';

function Messages() {
  const [conversations, setConversations] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [draftMessage, setDraftMessage] = useState('');

  useEffect(() => {
    fetchConversations().then((data) => {
      setConversations(data);
      if (data.length > 0) setSelectedId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (selectedId === null) return;
    fetchMessages(selectedId).then((messages) => {
      setConversations((prev) =>
        prev.map((c) => (c.id === selectedId ? { ...c, messages } : c))
      );
    });
  }, [selectedId]);

  const selectedConversation = conversations.find((c) => c.id === selectedId) ?? null;

  const handleSend = async () => {
    const content = draftMessage.trim();
    if (!content || !selectedConversation) return;

    const newMsg = { id: Date.now(), sender: 'user', text: content };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === selectedId ? { ...c, messages: [...c.messages, newMsg] } : c
      )
    );
    setDraftMessage('');

    await postMessage({
      conversation_id: selectedId,
      sender_type: 'user',
      sender_id: 1,
      message_text: content,
    });

    setTimeout(() => {
      const autoReply = {
        id: Date.now() + 1,
        sender: 'staff',
        text: 'Thanks for your message. A shelter team member will follow up soon.',
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === selectedId ? { ...c, messages: [...c.messages, autoReply] } : c
        )
      );
    }, 900);
  };

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
