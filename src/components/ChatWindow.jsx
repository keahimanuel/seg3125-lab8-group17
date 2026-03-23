function ChatWindow({ conversation, draftMessage, setDraftMessage, onSend }) {
  if (!conversation) {
    return (
      <section className="chat-window empty-state">
        <h3>Select a conversation</h3>
        <p>Choose a message thread to start communicating with the shelter team.</p>
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
          placeholder="Type your message"
        />
        <button className="button primary-button" onClick={onSend}>Send</button>
      </div>
    </section>
  );
}

export default ChatWindow;
