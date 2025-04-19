function UsernameInput({ userName, setuserName, className }) {
    return (
      <div className={className}>
        <label className="input-label">User Name</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setuserName(e.target.value)}
          className="input-field"
          required
        />
      </div>
    );
  }
  
  export default UsernameInput;