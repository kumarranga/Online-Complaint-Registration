function statusClass(status) {
  if (status === "In Progress") return "progress";
  return status.toLowerCase();
}

function Status({ agents, complaints }) {
  function agentName(agentId) {
    return agents.find((agent) => agent.id === agentId)?.name || "Not assigned";
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Complaint Status</h2>
          <p>Track your submitted complaints and assigned agent.</p>
        </div>
      </div>

      <div className="complaint-list">
        {complaints.length === 0 ? (
          <div className="empty-state">No complaints registered yet.</div>
        ) : (
          complaints.map((complaint) => (
            <article className="complaint-card" key={complaint.id}>
              <div className="complaint-title">
                <div>
                  <h3>{complaint.subject}</h3>
                  <p className="meta">
                    {complaint.id} • {complaint.city} • {complaint.createdAt}
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
                <span className="badge">{agentName(complaint.assignedAgentId)}</span>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

export default Status;

