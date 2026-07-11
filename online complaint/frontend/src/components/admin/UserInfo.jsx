function UserInfo({ users, onRemoveUser }) {
  const citizenUsers = users.filter((user) => user.role === "user");

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>User Information</h2>
          <p>Registered citizens in the complaint portal.</p>
        </div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {citizenUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.joinedAt}</td>
                <td>
                  <button className="small-btn" type="button" onClick={() => onRemoveUser(user.id)}>
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

export default UserInfo;

