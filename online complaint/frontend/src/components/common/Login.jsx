import { useState } from "react";

const loginRoles = [
  { label: "User", role: "user", email: "user@complaintcare.com", password: "user123" },
  { label: "Agent", role: "agent", email: "agent@complaintcare.com", password: "agent123" },
  { label: "Admin", role: "admin", email: "admin@complaintcare.com", password: "admin123" }
];

function Login({ onLogin, onNavigate }) {
  const [form, setForm] = useState({
    role: loginRoles[0].role,
    email: loginRoles[0].email,
    password: loginRoles[0].password
  });

  function updateField(event) {
    if (event.target.name === "role") {
      const selected = loginRoles.find((item) => item.role === event.target.value);
      setForm({
        role: selected.role,
        email: selected.email,
        password: selected.password
      });
      return;
    }

    setForm((values) => ({ ...values, [event.target.name]: event.target.value }));
  }

  function submit(event) {
    event.preventDefault();
    onLogin(form);
  }

  return (
    <section className="auth-page">
      <form className="auth-panel" onSubmit={submit}>
        <p className="eyebrow">Secure access</p>
        <h1>Login</h1>
        <p>Sign in to open your user, admin, or agent dashboard.</p>

        <div className="form-grid">
          <div className="field wide">
            <label htmlFor="loginRole">Login As</label>
            <select id="loginRole" name="role" value={form.role} onChange={updateField}>
              {loginRoles.map((item) => (
                <option key={item.role} value={item.role}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field wide">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={updateField}
              required
            />
          </div>
          <div className="field wide">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={updateField}
              required
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="primary-btn" type="submit">
            Login
          </button>
        </div>

        <p className="auth-switch">
          New user?{" "}
          <button className="text-button" type="button" onClick={() => onNavigate("signup")}>
            Create account
          </button>
        </p>
      </form>
    </section>
  );
}

export default Login;
