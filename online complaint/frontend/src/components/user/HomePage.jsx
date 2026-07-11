import { useMemo, useState } from "react";
import ChatWindow from "../common/ChatWindow";
import Complaint from "./Complaint";
import Status from "./Status";

function HomePage({ agents, chats, complaints, onCreateComplaint, onSendMessage, user }) {
  const [selectedId, setSelectedId] = useState(complaints[0]?.id || "");

  const selectedComplaint = useMemo(
    () => complaints.find((item) => item.id === selectedId) || complaints[0],
    [complaints, selectedId]
  );

  return (
    <section className="page dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">User dashboard</p>
          <h1>Hello, {user.name}</h1>
          <p>Register a complaint and follow the status from submission to resolution.</p>
        </div>
      </div>

      <div className="content-grid">
        <Complaint onCreateComplaint={onCreateComplaint} />
        <Status agents={agents} complaints={complaints} />
      </div>

      <div className="agent-board">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Your Cases</h2>
              <p>Select a case to view messages.</p>
            </div>
          </div>

          <div className="complaint-list">
            {complaints.length === 0 ? (
              <div className="empty-state">No cases available.</div>
            ) : (
              complaints.map((complaint) => (
                <button
                  className="accordion-trigger"
                  key={complaint.id}
                  type="button"
                  onClick={() => setSelectedId(complaint.id)}
                >
                  <span>{complaint.id}</span>
                  <span>{complaint.status}</span>
                </button>
              ))
            )}
          </div>
        </section>

        <ChatWindow
          complaint={selectedComplaint}
          messages={selectedComplaint ? chats[selectedComplaint.id] : []}
          onSendMessage={onSendMessage}
        />
      </div>
    </section>
  );
}

export default HomePage;

