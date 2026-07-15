import { useEffect, useMemo, useState } from "react";
import AdminHome from "./components/admin/AdminHome";
import AgentHome from "./components/agent/AgentHome";
import FooterC from "./components/common/FooterC";
import Home from "./components/common/Home";
import Login from "./components/common/Login";
import SignUp from "./components/common/SignUp";
import HomePage from "./components/user/HomePage";

const USERS_KEY = "complaintcare_users";
const COMPLAINTS_KEY = "complaintcare_complaints";
const CHAT_KEY = "complaintcare_chats";
const SESSION_KEY = "complaintcare_session";

const initialUsers = [
  {
    id: "u-admin",
    name: "Admin Officer",
    email: "admin@complaintcare.com",
    password: "admin123",
    phone: "9876500001",
    role: "admin",
    department: "Control Room",
    joinedAt: "2026-07-01"
  },
  {
    id: "u-agent",
    name: "Kiran Support",
    email: "agent@complaintcare.com",
    password: "agent123",
    phone: "9876500002",
    role: "agent",
    department: "Public Works",
    joinedAt: "2026-07-02"
  },
  {
    id: "u-user",
    name: "Meera Kumar",
    email: "user@complaintcare.com",
    password: "user123",
    phone: "9876500003",
    role: "user",
    department: "Citizen",
    joinedAt: "2026-07-03"
  }
];

const initialComplaints = [
  {
    id: "CMP-1001",
    userId: "u-user",
    name: "Meera Kumar",
    phone: "9876500003",
    city: "Chennai",
    address: "12 Lake View Street",
    category: "Water Supply",
    priority: "High",
    subject: "No water supply in our street",
    description: "Water supply has been interrupted for two days and several families are affected.",
    status: "Assigned",
    assignedAgentId: "u-agent",
    createdAt: "2026-07-05",
    updatedAt: "2026-07-06"
  },
  {
    id: "CMP-1002",
    userId: "u-user",
    name: "Meera Kumar",
    phone: "9876500003",
    city: "Chennai",
    address: "8 Station Road",
    category: "Road Repair",
    priority: "Medium",
    subject: "Damaged road near bus stop",
    description: "The road surface is broken near the bus stop and needs repair before the rainy season.",
    status: "Pending",
    assignedAgentId: "",
    createdAt: "2026-07-07",
    updatedAt: "2026-07-07"
  }
];

const initialChats = {
  "CMP-1001": [
    {
      id: "msg-1",
      senderId: "u-agent",
      senderName: "Kiran Support",
      role: "agent",
      message: "I have received this complaint and contacted the local water office.",
      createdAt: "2026-07-06 10:15"
    },
    {
      id: "msg-2",
      senderId: "u-user",
      senderName: "Meera Kumar",
      role: "user",
      message: "Thank you. Please update once the team visits.",
      createdAt: "2026-07-06 10:42"
    }
  ]
};

function readStorage(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function stamp() {
  return new Date().toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function routeFromHash() {
  const route = window.location.hash.replace("#/", "");
  return route || "home";
}

function App() {
  const [route, setRoute] = useState(routeFromHash);
  const [users, setUsers] = useState(() => readStorage(USERS_KEY, initialUsers));
  const [complaints, setComplaints] = useState(() =>
    readStorage(COMPLAINTS_KEY, initialComplaints)
  );
  const [chats, setChats] = useState(() => readStorage(CHAT_KEY, initialChats));
  const [session, setSession] = useState(() => readStorage(SESSION_KEY, null));
  const [notice, setNotice] = useState("");

  useEffect(() => writeStorage(USERS_KEY, users), [users]);
  useEffect(() => writeStorage(COMPLAINTS_KEY, complaints), [complaints]);
  useEffect(() => writeStorage(CHAT_KEY, chats), [chats]);
  useEffect(() => writeStorage(SESSION_KEY, session), [session]);

  useEffect(() => {
    const onHashChange = () => setRoute(routeFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const currentUser = useMemo(
    () => users.find((user) => user.id === session?.userId) || null,
    [session, users]
  );

  const agents = useMemo(() => users.filter((user) => user.role === "agent"), [users]);
  const appStats = useMemo(
    () => ({
      total: complaints.length,
      pending: complaints.filter((item) => item.status === "Pending").length,
      assigned: complaints.filter((item) => item.status === "Assigned").length,
      progress: complaints.filter((item) => item.status === "In Progress").length,
      resolved: complaints.filter((item) => item.status === "Resolved").length
    }),
    [complaints]
  );

  function navigate(nextRoute) {
    window.location.hash = `/${nextRoute}`;
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function showNotice(message) {
    setNotice(message);
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => setNotice(""), 3200);
  }

  function handleLogin({ email, password, role }) {
    const user = users.find(
      (item) =>
        item.role === role &&
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password
    );

    if (!user) {
      showNotice("Invalid email or password.");
      return false;
    }

    setSession({ userId: user.id });
    showNotice(`Welcome back, ${user.name}.`);
    navigate(user.role);
    return true;
  }

  function handleSignup(form) {
    const emailExists = users.some(
      (user) => user.email.toLowerCase() === form.email.trim().toLowerCase()
    );

    if (emailExists) {
      showNotice("An account with this email already exists.");
      return false;
    }

    const newUser = {
      id: `u-${Date.now()}`,
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
      phone: form.phone.trim(),
      role: form.role,
      department: form.role === "agent" ? form.department : "Citizen",
      joinedAt: today()
    };

    setUsers((items) => [...items, newUser]);
    showNotice("Registration successful. Please login.");
    navigate("login");
    return true;
  }

  function handleLogout() {
    setSession(null);
    showNotice("You have logged out.");
    navigate("home");
  }

  function handleCreateComplaint(form) {
    if (!currentUser) {
      navigate("login");
      return;
    }

    const complaint = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      name: currentUser.name,
      phone: currentUser.phone,
      city: form.city.trim(),
      address: form.address.trim(),
      category: form.category,
      priority: form.priority,
      subject: form.subject.trim(),
      description: form.description.trim(),
      status: "Pending",
      assignedAgentId: "",
      createdAt: today(),
      updatedAt: today()
    };

    setComplaints((items) => [complaint, ...items]);
    showNotice(`Complaint ${complaint.id} registered successfully.`);
  }

  function updateComplaint(complaintId, updates) {
    setComplaints((items) =>
      items.map((item) =>
        item.id === complaintId ? { ...item, ...updates, updatedAt: today() } : item
      )
    );
  }

  function assignComplaint(complaintId, agentId) {
    updateComplaint(complaintId, {
      assignedAgentId: agentId,
      status: agentId ? "Assigned" : "Pending"
    });
    showNotice(agentId ? "Complaint assigned to agent." : "Complaint moved to pending.");
  }

  function updateStatus(complaintId, status) {
    updateComplaint(complaintId, { status });
    showNotice(`Complaint marked as ${status}.`);
  }

  function addMessage(complaintId, message) {
    if (!currentUser || !message.trim()) return;

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      role: currentUser.role,
      message: message.trim(),
      createdAt: stamp()
    };

    setChats((items) => ({
      ...items,
      [complaintId]: [...(items[complaintId] || []), newMessage]
    }));
  }

  function removeUser(userId) {
    if (userId === currentUser?.id) {
      showNotice("You cannot remove the signed-in account.");
      return;
    }

    setUsers((items) => items.filter((item) => item.id !== userId));
    setComplaints((items) =>
      items.map((item) =>
        item.assignedAgentId === userId
          ? { ...item, assignedAgentId: "", status: "Pending", updatedAt: today() }
          : item
      )
    );
    showNotice("Account removed.");
  }

  function resetDemoData() {
    setUsers(initialUsers);
    setComplaints(initialComplaints);
    setChats(initialChats);
    setSession(null);
    showNotice("Demo data has been reset.");
    navigate("home");
  }

  function dashboardForRole() {
    if (!currentUser) {
      return <Login onLogin={handleLogin} onNavigate={navigate} />;
    }

    if (currentUser.role === "admin") {
      return (
        <AdminHome
          agents={agents}
          complaints={complaints}
          onAssign={assignComplaint}
          onRemoveUser={removeUser}
          stats={appStats}
          users={users}
        />
      );
    }

    if (currentUser.role === "agent") {
      return (
        <AgentHome
          chats={chats}
          complaints={complaints.filter(
            (item) => item.assignedAgentId === currentUser.id
          )}
          onSendMessage={addMessage}
          onUpdateStatus={updateStatus}
          user={currentUser}
          users={users}
        />
      );
    }

    return (
      <HomePage
        agents={agents}
        chats={chats}
        complaints={complaints.filter((item) => item.userId === currentUser.id)}
        onCreateComplaint={handleCreateComplaint}
        onSendMessage={addMessage}
        user={currentUser}
      />
    );
  }

  let page = <Home onNavigate={navigate} stats={appStats} />;

  if (route === "login") {
    page = <Login onLogin={handleLogin} onNavigate={navigate} />;
  } else if (route === "signup") {
    page = <SignUp onNavigate={navigate} onSignup={handleSignup} />;
  } else if (["admin", "agent", "user", "dashboard"].includes(route)) {
    page = dashboardForRole();
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <button className="brand" type="button" onClick={() => navigate("home")}>
          <span className="brand-mark">CC</span>
          <span>ComplaintCare</span>
        </button>

        <nav className="topnav" aria-label="Primary navigation">
          <button type="button" onClick={() => navigate("home")}>
            Home
          </button>
          {currentUser ? (
            <>
              <button type="button" onClick={() => navigate(currentUser.role)}>
                Dashboard
              </button>
              <button className="danger-link" type="button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => navigate("signup")}>
                Sign Up
              </button>
              <button type="button" onClick={() => navigate("login")}>
                Login
              </button>
            </>
          )}
        </nav>
      </header>

      {notice && <div className="notice">{notice}</div>}

      <main>{page}</main>

      <FooterC onReset={resetDemoData} />
    </div>
  );
}

export default App;
