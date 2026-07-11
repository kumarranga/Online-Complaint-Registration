
      const USERS_KEY = "complaintcare_demo_users";
      const COMPLAINTS_KEY = "complaintcare_demo_complaints";
      const CHATS_KEY = "complaintcare_demo_chats";
      const SESSION_KEY = "complaintcare_demo_session";

      const seedUsers = [
        { id: "u-admin", name: "Admin Officer", email: "admin@complaintcare.com", password: "admin123", phone: "9876500001", role: "admin", department: "Control Room", joinedAt: "2026-07-01" },
        { id: "u-agent", name: "Kiran Support", email: "agent@complaintcare.com", password: "agent123", phone: "9876500002", role: "agent", department: "Public Works", joinedAt: "2026-07-02" },
        { id: "u-user", name: "Meera Kumar", email: "user@complaintcare.com", password: "user123", phone: "9876500003", role: "user", department: "Citizen", joinedAt: "2026-07-03" }
      ];

      const seedComplaints = [
        { id: "CMP-1001", userId: "u-user", name: "Meera Kumar", phone: "9876500003", city: "Chennai", address: "12 Lake View Street", category: "Water Supply", priority: "High", subject: "No water supply in our street", description: "Water supply has been interrupted for two days and several families are affected.", status: "Assigned", assignedAgentId: "u-agent", createdAt: "2026-07-05", updatedAt: "2026-07-06" },
        { id: "CMP-1002", userId: "u-user", name: "Meera Kumar", phone: "9876500003", city: "Chennai", address: "8 Station Road", category: "Road Repair", priority: "Medium", subject: "Damaged road near bus stop", description: "The road surface is broken near the bus stop and needs repair before the rainy season.", status: "Pending", assignedAgentId: "", createdAt: "2026-07-07", updatedAt: "2026-07-07" }
      ];

      const seedChats = {
        "CMP-1001": [
          { id: "msg-1", senderId: "u-agent", senderName: "Kiran Support", role: "agent", message: "I have received this complaint and contacted the local water office.", createdAt: "2026-07-06 10:15" },
          { id: "msg-2", senderId: "u-user", senderName: "Meera Kumar", role: "user", message: "Thank you. Please update once the team visits.", createdAt: "2026-07-06 10:42" }
        ]
      };

      let state = {
        users: read(USERS_KEY, seedUsers),
        complaints: read(COMPLAINTS_KEY, seedComplaints),
        chats: read(CHATS_KEY, seedChats),
        session: read(SESSION_KEY, null),
        route: location.hash.replace("#/", "") || "home",
        selectedComplaint: ""
      };

      const app = document.querySelector("#app");
      const nav = document.querySelector("#nav");
      const notice = document.querySelector("#notice");

      function read(key, fallback) {
        try {
          return JSON.parse(localStorage.getItem(key)) || fallback;
        } catch {
          return fallback;
        }
      }

      function save() {
        localStorage.setItem(USERS_KEY, JSON.stringify(state.users));
        localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(state.complaints));
        localStorage.setItem(CHATS_KEY, JSON.stringify(state.chats));
        localStorage.setItem(SESSION_KEY, JSON.stringify(state.session));
      }

      function today() {
        return new Date().toISOString().slice(0, 10);
      }

      function stamp() {
        return new Date().toLocaleString([], { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });
      }

      function currentUser() {
        return state.users.find((user) => user.id === state.session?.userId) || null;
      }

      function agents() {
        return state.users.filter((user) => user.role === "agent");
      }

      function stats() {
        return {
          total: state.complaints.length,
          pending: state.complaints.filter((item) => item.status === "Pending").length,
          assigned: state.complaints.filter((item) => item.status === "Assigned").length,
          progress: state.complaints.filter((item) => item.status === "In Progress").length,
          resolved: state.complaints.filter((item) => item.status === "Resolved").length
        };
      }

      function statusClass(status) {
        return status === "In Progress" ? "progress" : status.toLowerCase();
      }

      function esc(value) {
        return String(value ?? "").replace(/[&<>"']/g, (match) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[match]));
      }

      function go(route) {
        state.route = route;
        location.hash = `/${route}`;
        render();
        scrollTo({ top: 0, behavior: "smooth" });
      }

      function flash(message) {
        notice.textContent = message;
        notice.hidden = false;
        clearTimeout(flash.timer);
        flash.timer = setTimeout(() => (notice.hidden = true), 3200);
      }

      function renderNav() {
        const user = currentUser();
        nav.innerHTML = user
          ? `<button data-route="home">Home</button><button data-route="${user.role}">Dashboard</button><button class="danger" id="logoutBtn">Logout</button>`
          : `<button data-route="home">Home</button><button data-route="signup">Sign Up</button><button data-route="login">Login</button>`;
      }

      function homeView() {
        const s = stats();
        return `
          <section class="page hero">
            <div class="hero-copy">
              <p class="eyebrow">Online complaint registration</p>
              <h1>ComplaintCare</h1>
              <p>A simple portal where citizens register complaints, administrators assign work, and agents update every case until it is resolved.</p>
              <div class="actions">
                <button class="primary" data-route="signup">Register Complaint</button>
                <button class="secondary" data-route="login">Login</button>
              </div>
              <div class="stats">
                <div class="stat"><strong>${s.total}</strong><span>Total complaints</span></div>
                <div class="stat"><strong>${s.pending}</strong><span>Pending</span></div>
                <div class="stat"><strong>${s.progress}</strong><span>In progress</span></div>
                <div class="stat"><strong>${s.resolved}</strong><span>Resolved</span></div>
              </div>
            </div>
            <img src="src/Images/complaint-care-dashboard.svg" alt="ComplaintCare dashboard preview" />
          </section>`;
      }

      function loginView() {
        return `
          <section class="auth">
            <form class="auth-panel" id="loginForm">
              <p class="eyebrow">Secure access</p>
              <h1>Login</h1>
              <p>Sign in to open your user, admin, or agent dashboard.</p>
              <div class="form-grid">
                <div class="field wide"><label>Login As</label><select name="role"><option value="user" selected>User</option><option value="agent">Agent</option><option value="admin">Admin</option></select></div>
                <div class="field wide"><label>Email</label><input name="email" type="email" value="user@complaintcare.com" required /></div>
                <div class="field wide"><label>Password</label><input name="password" type="password" value="user123" required /></div>
              </div>
              <div class="actions">
                <button class="primary" type="submit">Login</button>
              </div>
              <p>New user? <button class="text-button" type="button" data-route="signup">Create account</button></p>
            </form>
          </section>`;
      }

      function signupView() {
        return `
          <section class="auth">
            <form class="auth-panel" id="signupForm">
              <p class="eyebrow">Registration</p>
              <h1>Sign Up</h1>
              <p>Create an account to register complaints or join as a service agent.</p>
              <div class="form-grid">
                <div class="field wide"><label>Full Name</label><input name="name" required /></div>
                <div class="field wide"><label>Email</label><input name="email" type="email" required /></div>
                <div class="field"><label>Phone</label><input name="phone" minlength="10" required /></div>
                <div class="field"><label>Account Type</label><select name="role"><option value="user">User</option><option value="agent">Agent</option></select></div>
                <div class="field wide"><label>Department</label><select name="department"><option>Public Works</option><option>Water Supply</option><option>Electricity</option><option>Sanitation</option><option>Revenue Office</option></select></div>
                <div class="field wide"><label>Password</label><input name="password" type="password" minlength="6" required /></div>
              </div>
              <div class="actions">
                <button class="primary" type="submit">Register</button>
                <button class="secondary" type="button" data-route="login">Back to Login</button>
              </div>
            </form>
          </section>`;
      }

      function complaintCard(item, options = {}) {
        const agent = agents().find((user) => user.id === item.assignedAgentId)?.name || "Not assigned";
        const statusButtons = options.agent
          ? `<div class="toolbar">${["Assigned", "In Progress", "Resolved"].map((status) => `<button class="status ${item.status === status ? "active" : ""}" data-status="${status}" data-id="${item.id}">${status}</button>`).join("")}<button class="small" data-select="${item.id}">Messages</button></div>`
          : "";
        return `
          <article class="card">
            <div class="card-title">
              <div><h3>${esc(item.subject)}</h3><p class="meta">${item.id} - ${esc(item.city)} - ${item.createdAt}</p></div>
              <span class="badge ${statusClass(item.status)}">${item.status}</span>
            </div>
            <p class="desc">${esc(item.description)}</p>
            <div class="badges">
              <span class="badge ${item.priority.toLowerCase()}">${item.priority}</span>
              <span class="badge">${esc(item.category)}</span>
              <span class="badge">${esc(agent)}</span>
            </div>
            ${statusButtons}
          </article>`;
      }

      function userView() {
        const user = currentUser();
        if (!user) return loginView();
        const mine = state.complaints.filter((item) => item.userId === user.id);
        const selected = state.selectedComplaint || mine[0]?.id || "";
        state.selectedComplaint = selected;
        const selectedComplaint = mine.find((item) => item.id === selected);
        return `
          <section class="page dashboard">
            <div class="dashboard-header"><div><p class="eyebrow">User dashboard</p><h1>Hello, ${esc(user.name)}</h1><p class="muted">Register a complaint and follow the status from submission to resolution.</p></div></div>
            <div class="content-grid">
              <section class="panel">
                <div class="panel-header"><div><h2>Register Complaint</h2><p class="muted">Fill the complaint details for review by the admin team.</p></div></div>
                <form class="form-grid" id="complaintForm">
                  <div class="field"><label>Category</label><select name="category"><option>Water Supply</option><option>Road Repair</option><option>Electricity</option><option>Sanitation</option><option>Public Safety</option><option>Other</option></select></div>
                  <div class="field"><label>Priority</label><select name="priority"><option>Low</option><option selected>Medium</option><option>High</option></select></div>
                  <div class="field"><label>City</label><input name="city" required /></div>
                  <div class="field"><label>Address</label><input name="address" required /></div>
                  <div class="field wide"><label>Subject</label><input name="subject" required /></div>
                  <div class="field wide"><label>Description</label><textarea name="description" required></textarea></div>
                  <div class="actions wide"><button class="primary" type="submit">Submit Complaint</button></div>
                </form>
              </section>
              <section class="panel">
                <div class="panel-header"><div><h2>Complaint Status</h2><p class="muted">Track submitted complaints and assigned agent.</p></div></div>
                <div class="list">${mine.length ? mine.map((item) => complaintCard(item)).join("") : `<div class="empty">No complaints registered yet.</div>`}</div>
              </section>
            </div>
            <div class="agent-grid">
              <section class="panel"><div class="panel-header"><div><h2>Your Cases</h2><p class="muted">Select a case to view messages.</p></div></div><div class="list">${mine.length ? mine.map((item) => `<button class="secondary" data-select="${item.id}">${item.id} - ${item.status}</button>`).join("") : `<div class="empty">No cases available.</div>`}</div></section>
              ${chatView(selectedComplaint)}
            </div>
          </section>`;
      }

      function adminView() {
        const user = currentUser();
        if (!user || user.role !== "admin") return loginView();
        const s = stats();
        return `
          <section class="page dashboard">
            <div class="dashboard-header"><div><p class="eyebrow">Admin dashboard</p><h1>Complaint Control Room</h1><p class="muted">View users, agents, and complaints from one place.</p></div></div>
            <div class="stats">
              <div class="stat"><strong>${s.total}</strong><span>Total</span></div>
              <div class="stat"><strong>${s.pending}</strong><span>Pending</span></div>
              <div class="stat"><strong>${s.assigned}</strong><span>Assigned</span></div>
              <div class="stat"><strong>${s.resolved}</strong><span>Resolved</span></div>
            </div>
            <div class="content-grid">
              <section class="panel">
                <div class="panel-header"><div><h2>Complaint Queue</h2><p class="muted">Review complaints and assign each case to an agent.</p></div></div>
                <div class="list">${state.complaints.map((item) => `
                  <article class="card">
                    <div class="card-title"><div><h3>${item.id} - ${esc(item.subject)}</h3><p class="meta">${esc(item.name)} - ${esc(item.city)}</p></div><span class="badge ${statusClass(item.status)}">${item.status}</span></div>
                    <p class="desc">${esc(item.description)}</p>
                    <div class="field"><label>Assign Agent</label><select data-assign="${item.id}"><option value="">Not assigned</option>${agents().map((agent) => `<option value="${agent.id}" ${item.assignedAgentId === agent.id ? "selected" : ""}>${esc(agent.name)} - ${esc(agent.department)}</option>`).join("")}</select></div>
                  </article>`).join("")}</div>
              </section>
              <div class="dashboard">${agentTable()}${userTable()}</div>
            </div>
          </section>`;
      }

      function agentTable() {
        const rows = agents().map((agent) => `<tr><td>${esc(agent.name)}</td><td>${esc(agent.email)}</td><td>${esc(agent.department)}</td><td>${state.complaints.filter((item) => item.assignedAgentId === agent.id).length}</td><td><button class="small" data-remove="${agent.id}">Remove</button></td></tr>`).join("");
        return `<section class="panel"><div class="panel-header"><div><h2>Agent Information</h2><p class="muted">Available agents and assigned complaint count.</p></div></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Department</th><th>Cases</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
      }

      function userTable() {
        const rows = state.users.filter((user) => user.role === "user").map((user) => `<tr><td>${esc(user.name)}</td><td>${esc(user.email)}</td><td>${esc(user.phone)}</td><td>${user.joinedAt}</td><td><button class="small" data-remove="${user.id}">Remove</button></td></tr>`).join("");
        return `<section class="panel"><div class="panel-header"><div><h2>User Information</h2><p class="muted">Registered citizens in the complaint portal.</p></div></div><div class="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Action</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
      }

      function agentView() {
        const user = currentUser();
        if (!user || user.role !== "agent") return loginView();
        const assigned = state.complaints.filter((item) => item.assignedAgentId === user.id);
        const selected = state.selectedComplaint || assigned[0]?.id || "";
        state.selectedComplaint = selected;
        const selectedComplaint = assigned.find((item) => item.id === selected);
        return `
          <section class="page dashboard">
            <div class="dashboard-header"><div><p class="eyebrow">Agent dashboard</p><h1>${esc(user.name)}</h1><p class="muted">Assigned complaints appear here with status controls and message updates.</p></div></div>
            <div class="agent-grid">
              <section class="panel">
                <div class="panel-header"><div><h2>Assigned Complaints</h2><p class="muted">${assigned.length} active case${assigned.length === 1 ? "" : "s"}</p></div></div>
                <div class="list">${assigned.length ? assigned.map((item) => complaintCard(item, { agent: true })).join("") : `<div class="empty">No complaints assigned yet.</div>`}</div>
              </section>
              ${chatView(selectedComplaint)}
            </div>
          </section>`;
      }

      function chatView(complaint) {
        if (!complaint) return `<section class="panel"><div class="panel-header"><div><h2>Messages</h2><p class="muted">Select a complaint</p></div></div><div class="empty">No complaint selected.</div></section>`;
        const messages = state.chats[complaint.id] || [];
        return `
          <section class="panel">
            <div class="panel-header"><div><h2>Messages</h2><p class="muted">${complaint.id}</p></div></div>
            <div class="chat-log">${messages.length ? messages.map((item) => `<article class="message ${item.role}"><strong>${esc(item.senderName)}</strong><p>${esc(item.message)}</p><span class="meta">${item.createdAt}</span></article>`).join("") : `<div class="empty">No messages yet.</div>`}</div>
            <form class="form-grid" id="chatForm" data-complaint="${complaint.id}">
              <div class="field wide"><label>Message</label><textarea name="message" required></textarea></div>
              <div class="actions wide"><button class="primary" type="submit">Send</button></div>
            </form>
          </section>`;
      }

      function render() {
        renderNav();
        const user = currentUser();
        if (["admin", "agent", "user"].includes(state.route) && !user) state.route = "login";
        if (state.route === "login") app.innerHTML = loginView();
        else if (state.route === "signup") app.innerHTML = signupView();
        else if (state.route === "admin") app.innerHTML = adminView();
        else if (state.route === "agent") app.innerHTML = agentView();
        else if (state.route === "user" || state.route === "dashboard") app.innerHTML = userView();
        else app.innerHTML = homeView();
        save();
      }

      document.body.addEventListener("click", (event) => {
        const routeButton = event.target.closest("[data-route]");
        if (routeButton) go(routeButton.dataset.route);

        const logout = event.target.closest("#logoutBtn");
        if (logout) {
          state.session = null;
          flash("You have logged out.");
          go("home");
        }

        const select = event.target.closest("[data-select]");
        if (select) {
          state.selectedComplaint = select.dataset.select;
          render();
        }

        const status = event.target.closest("[data-status]");
        if (status) {
          updateComplaint(status.dataset.id, { status: status.dataset.status });
          flash(`Complaint marked as ${status.dataset.status}.`);
          render();
        }

        const remove = event.target.closest("[data-remove]");
        if (remove) {
          state.users = state.users.filter((user) => user.id !== remove.dataset.remove);
          state.complaints = state.complaints.map((item) => item.assignedAgentId === remove.dataset.remove ? { ...item, assignedAgentId: "", status: "Pending", updatedAt: today() } : item);
          flash("Account removed.");
          render();
        }
      });

      document.body.addEventListener("change", (event) => {
        if (event.target.matches("#loginForm [name=role]")) {
          const account = {
            user: { email: "user@complaintcare.com", password: "user123" },
            agent: { email: "agent@complaintcare.com", password: "agent123" },
            admin: { email: "admin@complaintcare.com", password: "admin123" }
          }[event.target.value];
          document.querySelector("#loginForm [name=email]").value = account.email;
          document.querySelector("#loginForm [name=password]").value = account.password;
        }

        if (event.target.matches("[data-assign]")) {
          updateComplaint(event.target.dataset.assign, { assignedAgentId: event.target.value, status: event.target.value ? "Assigned" : "Pending" });
          flash(event.target.value ? "Complaint assigned to agent." : "Complaint moved to pending.");
          render();
        }
      });

      document.body.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = Object.fromEntries(new FormData(event.target).entries());

        if (event.target.id === "loginForm") {
          const user = state.users.find((item) => item.role === data.role && item.email.toLowerCase() === data.email.trim().toLowerCase() && item.password === data.password);
          if (!user) return flash("Invalid email or password.");
          state.session = { userId: user.id };
          state.selectedComplaint = "";
          flash(`Welcome back, ${user.name}.`);
          go(user.role);
        }

        if (event.target.id === "signupForm") {
          const exists = state.users.some((item) => item.email.toLowerCase() === data.email.trim().toLowerCase());
          if (exists) return flash("An account with this email already exists.");
          state.users.push({ id: `u-${Date.now()}`, name: data.name.trim(), email: data.email.trim(), password: data.password, phone: data.phone.trim(), role: data.role, department: data.role === "agent" ? data.department : "Citizen", joinedAt: today() });
          flash("Registration successful. Please login.");
          go("login");
        }

        if (event.target.id === "complaintForm") {
          const user = currentUser();
          state.complaints.unshift({ id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`, userId: user.id, name: user.name, phone: user.phone, city: data.city.trim(), address: data.address.trim(), category: data.category, priority: data.priority, subject: data.subject.trim(), description: data.description.trim(), status: "Pending", assignedAgentId: "", createdAt: today(), updatedAt: today() });
          flash("Complaint registered successfully.");
          event.target.reset();
          render();
        }

        if (event.target.id === "chatForm") {
          const user = currentUser();
          const complaintId = event.target.dataset.complaint;
          state.chats[complaintId] = state.chats[complaintId] || [];
          state.chats[complaintId].push({ id: `msg-${Date.now()}`, senderId: user.id, senderName: user.name, role: user.role, message: data.message.trim(), createdAt: stamp() });
          flash("Message sent.");
          render();
        }
      });

      document.querySelector("#resetBtn").addEventListener("click", () => {
        state.users = structuredClone(seedUsers);
        state.complaints = structuredClone(seedComplaints);
        state.chats = structuredClone(seedChats);
        state.session = null;
        state.selectedComplaint = "";
        flash("Demo data has been reset.");
        go("home");
      });

      window.addEventListener("hashchange", () => {
        state.route = location.hash.replace("#/", "") || "home";
        render();
      });

      function updateComplaint(id, updates) {
        state.complaints = state.complaints.map((item) => item.id === id ? { ...item, ...updates, updatedAt: today() } : item);
      }

      render();
    
