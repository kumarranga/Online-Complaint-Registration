import { useState } from "react";

function ChatWindow({ complaint, messages = [], onSendMessage }) {
  const [message, setMessage] = useState("");

  function submit(event) {
    event.preventDefault();
    onSendMessage(complaint.id, message);
    setMessage("");
  }

  return (
    <section className="panel chat-window">
      <div className="panel-header">
        <div>
          <h2>Messages</h2>
          <p>{complaint ? complaint.id : "Select a complaint"}</p>
        </div>
      </div>

      {!complaint ? (
        <div className="empty-state">No complaint selected.</div>
      ) : (
        <>
          <div className="chat-log" aria-live="polite">
            {messages.length === 0 ? (
              <div className="empty-state">No messages yet.</div>
            ) : (
              messages.map((item) => (
                <article className={`chat-message ${item.role}`} key={item.id}>
                  <strong>{item.senderName}</strong>
                  <p>{item.message}</p>
                  <span>{item.createdAt}</span>
                </article>
              ))
            )}
          </div>

          <form className="form-grid" onSubmit={submit}>
            <div className="field wide">
              <label htmlFor="chatMessage">Message</label>
              <textarea
                id="chatMessage"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                required
              />
            </div>
            <div className="form-actions wide">
              <button className="primary-btn" type="submit">
                Send
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}

export default ChatWindow;

