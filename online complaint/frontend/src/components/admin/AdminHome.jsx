import AccordionAdmin from "./AccordionAdmin";
import AgentInfo from "./AgentInfo";
import UserInfo from "./UserInfo";

function AdminHome({ agents, complaints, onAssign, onRemoveUser, stats, users }) {
  return (
    <section className="page dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">Admin dashboard</p>
          <h1>Complaint Control Room</h1>
          <p>View users, agents, and complaints from one place.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat">
          <strong>{stats.total}</strong>
          <span>Total</span>
        </div>
        <div className="stat">
          <strong>{stats.pending}</strong>
          <span>Pending</span>
        </div>
        <div className="stat">
          <strong>{stats.assigned}</strong>
          <span>Assigned</span>
        </div>
        <div className="stat">
          <strong>{stats.resolved}</strong>
          <span>Resolved</span>
        </div>
      </div>

      <div className="content-grid">
        <AccordionAdmin agents={agents} complaints={complaints} onAssign={onAssign} />
        <div className="dashboard">
          <AgentInfo agents={agents} complaints={complaints} onRemoveUser={onRemoveUser} />
          <UserInfo users={users} onRemoveUser={onRemoveUser} />
        </div>
      </div>
    </section>
  );
}

export default AdminHome;

