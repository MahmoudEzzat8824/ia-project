function EmailInput({ email, setEmail, className }) {
    return (
      <div className={className}>
        <label className="input-label">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field"
          required
        />
      </div>
    );
  }
  
  export default EmailInput;