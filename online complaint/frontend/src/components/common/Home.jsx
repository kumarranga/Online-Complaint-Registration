import heroImage from "../../Images/complaint-care-dashboard.svg";

function Home({ onNavigate, stats }) {
  return (
    <section className="page hero">
      <div className="hero-copy">
        <p className="eyebrow">Online complaint registration</p>
        <h1>ComplaintCare</h1>
        <p>
          A simple portal where citizens register complaints, administrators assign
          work, and agents update every case until it is resolved.
        </p>

        <div className="hero-actions">
          <button className="primary-btn" type="button" onClick={() => onNavigate("signup")}>
            Register Complaint
          </button>
          <button className="secondary-btn" type="button" onClick={() => onNavigate("login")}>
            Login
          </button>
        </div>

        <div className="stat-grid" aria-label="Complaint overview">
          <div className="stat">
            <strong>{stats.total}</strong>
            <span>Total complaints</span>
          </div>
          <div className="stat">
            <strong>{stats.pending}</strong>
            <span>Pending</span>
          </div>
          <div className="stat">
            <strong>{stats.progress}</strong>
            <span>In progress</span>
          </div>
          <div className="stat">
            <strong>{stats.resolved}</strong>
            <span>Resolved</span>
          </div>
        </div>
      </div>

      <figure className="hero-media">
        <img src={heroImage} alt="ComplaintCare dashboard preview" />
      </figure>
    </section>
  );
}

export default Home;
