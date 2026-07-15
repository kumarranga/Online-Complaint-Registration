function AgentInfo({ agents, complaints, onRemoveUser }) {
  function assignedCount(agentId) {
    return complaints.filter((item) => item.assignedAgentId === agentId).length;
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Agent Information</h2>
          <p>Available agents and assigned complaint count.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Cases</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td>{agent.name}</td>
                <td>{agent.email}</td>
                <td>{agent.department}</td>
                <td>{assignedCount(agent.id)}</td>
                <td>
                  <button className="small-btn" type="button" onClick={() => onRemoveUser(agent.id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AgentInfo;

