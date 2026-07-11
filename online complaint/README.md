# Online Complaint Registration

A React demo project for a short-term internship submission. It includes user registration, login, complaint submission, complaint tracking, admin assignment, agent status updates, and a small complaint chat panel.

## Demo Accounts

- Admin: `admin@complaintcare.com` / `admin123`
- Agent: `agent@complaintcare.com` / `agent123`
- User: `user@complaintcare.com` / `user123`

## Run Locally

```bash
cd frontend
npm install
npm run dev
```

Open the local URL shown in the terminal.

If npm is slow on your machine, open `frontend/demo.html` directly in a browser. It is a dependency-free demo version with the same complaint workflow.

## Project Notes

- Data is stored in browser `localStorage`, so the app works without a backend.
- Use the admin dashboard to assign pending complaints to agents.
- Use the agent dashboard to update complaint status and send short updates.
