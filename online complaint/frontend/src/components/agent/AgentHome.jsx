import { useMemo, useState } from "react";
import ChatWindow from "../common/ChatWindow";

const statuses = ["Assigned", "In Progress", "Resolved"];

function statusClass(status) {
  if (status === "In Progress") return "progress";
  return status.toLowerCase();
}

function AgentHome({ chats, complaints, onSendMessage, onUpdateStatus, user }) {
  const [selectedId, setSelectedId] = useState(complaints[0]?.id || "");

  const selectedComplaint = useMemo(
    () => complaints.find((item) => item.id === selectedId) || complaints[0],
    [complaints, selectedId]
  );

  return (
    <section className="page dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Agent dashboard</p>
          <h1>{user.name}</h1>
          <p>Assigned complaints appear here with status controls and message updates.</p>
        </div>
      </div>

      <div className="agent-board">
        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Assigned Complaints</h2>
              <p>{complaints.length} active case{complaints.length === 1 ? "" : "s"}</p>
            </div>
          </div>

          <div className="complaint-list">
            {complaints.length === 0 ? (
              <div className="empty-state">No complaints assigned yet.</div>
            ) : (
              complaints.map((complaint) => (
                <article className="complaint-card" key={complaint.id}>
                  <div className="complaint-title">
                    <div>
                      <h3>{complaint.subject}</h3>
                      <p className="meta">
                        {complaint.id} • {complaint.name} • {complaint.city}
                      </p>
                    </div>
                    <span className={`badge ${statusClass(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>

                  <p className="description">{complaint.description}</p>

                  <div className="badge-row">
                    <span className={`badge ${complaint.priority.toLowerCase()}`}>
                      {complaint.priority}
                    </span>
                    <span className="badge">{complaint.category}</span>
                    <span className="badge">{complaint.phone}</span>
                  </div>

                  <div className="toolbar">
                    {statuses.map((status) => (
                      <button
                        className={`status-btn ${complaint.status === status ? "active" : ""}`}
                        key={status}
                        type="button"
                        onClick={() => onUpdateStatus(complaint.id, status)}
                      >
                        {status}
                      </button>
                    ))}
                    <button
                      className="small-btn"
                      type="button"
                      onClick={() => setSelectedId(complaint.id)}
                    >
                      Messages
                    </button>
                  </div>
                </article>
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

export default AgentHome;

