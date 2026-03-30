import { useT } from '../i18n/LanguageContext';

function ChatWindow({ conversation, draftMessage, setDraftMessage, onSend }) {
  const t = useT();

  if (!conversation) {
    return (
      <section className="chat-window empty-state">
        <h3>{t('messages.empty.heading')}</h3>
        <p>{t('messages.empty.description')}</p>
      </section>
    );
  }

  return (
    <section className="chat-window">
      <div className="chat-header">
        <h3>{conversation.title}</h3>
        <p>{conversation.participant}</p>
      </div>

      <div className="chat-messages">
        {conversation.messages.map((message) => (
          <div
            key={message.id}
            className={message.sender === 'user' ? 'chat-bubble user-bubble' : 'chat-bubble staff-bubble'}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          value={draftMessage}
          onChange={(e) => setDraftMessage(e.target.value)}
          placeholder={t('messages.placeholder')}
        />
        <button className="button primary-button" onClick={onSend}>{t('messages.send')}</button>
      </div>
    </section>
  );
}

export default ChatWindow;
