import { useState } from "react";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  role: "user",
  department: "Public Works"
};

function SignUp({ onNavigate, onSignup }) {
  const [form, setForm] = useState(emptyForm);

  function updateField(event) {
    setForm((values) => ({ ...values, [event.target.name]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    const created = onSignup(form);
    if (created) setForm(emptyForm);
  }

  return (
    <section className="auth-page">
      <form className="auth-panel" onSubmit={submit}>
        <p className="eyebrow">Registration</p>
        <h1>Sign Up</h1>
        <p>Create an account to register complaints or join as a service agent.</p>

        <div className="form-grid">
          <div className="field wide">
            <label htmlFor="name">Full Name</label>
            <input id="name" name="name" value={form.name} onChange={updateField} required />
          </div>
          <div className="field wide">
            <label htmlFor="signupEmail">Email</label>
            <input
              id="signupEmail"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={updateField}
              minLength="10"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="role">Account Type</label>
            <select id="role" name="role" value={form.role} onChange={updateField}>
              <option value="user">User</option>
              <option value="agent">Agent</option>
            </select>
          </div>
          {form.role === "agent" && (
            <div className="field wide">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                name="department"
                value={form.department}
                onChange={updateField}
              >
                <option>Public Works</option>
                <option>Water Supply</option>
                <option>Electricity</option>
                <option>Sanitation</option>
                <option>Revenue Office</option>
              </select>
            </div>
          )}
          <div className="field wide">
            <label htmlFor="signupPassword">Password</label>
            <input
              id="signupPassword"
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              minLength="6"
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="primary-btn" type="submit">
            Register
          </button>
          <button className="secondary-btn" type="button" onClick={() => onNavigate("login")}>
            Back to Login
          </button>
        </div>
      </form>
    </section>
  );
}

export default SignUp;

