import { useState } from "react";

const emptyComplaint = {
  city: "",
  address: "",
  category: "Water Supply",
  priority: "Medium",
  subject: "",
  description: ""
};

function Complaint({ onCreateComplaint }) {
  const [form, setForm] = useState(emptyComplaint);

  function updateField(event) {
    setForm((values) => ({ ...values, [event.target.name]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    onCreateComplaint(form);
    setForm(emptyComplaint);
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Register Complaint</h2>
          <p>Fill the complaint details for review by the admin team.</p>
        </div>
      </div>

      <form className="form-grid" onSubmit={submit}>
        <div className="field">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={form.category} onChange={updateField}>
            <option>Water Supply</option>
            <option>Road Repair</option>
            <option>Electricity</option>
            <option>Sanitation</option>
            <option>Public Safety</option>
            <option>Other</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select id="priority" name="priority" value={form.priority} onChange={updateField}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="city">City</label>
          <input id="city" name="city" value={form.city} onChange={updateField} required />
        </div>
        <div className="field">
          <label htmlFor="address">Address</label>
          <input id="address" name="address" value={form.address} onChange={updateField} required />
        </div>
        <div className="field wide">
          <label htmlFor="subject">Subject</label>
          <input
            id="subject"
            name="subject"
            value={form.subject}
            onChange={updateField}
            required
          />
        </div>
        <div className="field wide">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={updateField}
            required
          />
        </div>
        <div className="form-actions wide">
          <button className="primary-btn" type="submit">
            Submit Complaint
          </button>
        </div>
      </form>
    </section>
  );
}

export default Complaint;

