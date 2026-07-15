import { useState } from "react";

function statusClass(status) {
  if (status === "In Progress") return "progress";
  return status.toLowerCase();
}

function AccordionAdmin({ agents, complaints, onAssign }) {
  const [openId, setOpenId] = useState(complaints[0]?.id || "");

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Complaint Queue</h2>
          <p>Review complaints and assign each case to an agent.</p>
        </div>
      </div>

      <div className="accordion">
        {complaints.length === 0 ? (
          <div className="empty-state">No complaints available.</div>
        ) : (
          complaints.map((complaint) => (
            <article className="accordion-item" key={complaint.id}>
              <button
                className="accordion-trigger"
                type="button"
                onClick={() => setOpenId(openId === complaint.id ? "" : complaint.id)}
              >
                <span>
                  {complaint.id} • {complaint.subject}
                </span>
                <span className={`badge ${statusClass(complaint.status)}`}>
                  {complaint.status}
                </span>
              </button>

              {openId === complaint.id && (
                <div className="accordion-body">
                  <p className="description">{complaint.description}</p>
                  <div className="badge-row">
                    <span className={`badge ${complaint.priority.toLowerCase()}`}>
                      {complaint.priority}
                    </span>
                    <span className="badge">{complaint.category}</span>
                    <span className="badge">{complaint.city}</span>
                  </div>

                  <div className="assign-row">
                    <div className="field">
                      <label htmlFor={`agent-${complaint.id}`}>Assign Agent</label>
                      <select
                        id={`agent-${complaint.id}`}
                        value={complaint.assignedAgentId}
                        onChange={(event) => onAssign(complaint.id, event.target.value)}
                      >
                        <option value="">Not assigned</option>
                        {agents.map((agent) => (
                          <option key={agent.id} value={agent.id}>
                            {agent.name} - {agent.department}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button
                      className="secondary-btn"
                      type="button"
                      onClick={() => onAssign(complaint.id, "")}
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default AccordionAdmin;

