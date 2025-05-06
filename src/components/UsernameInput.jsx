
import '../styles/auth/components/inputs.css'; // Input field styles

function UsernameInput({ userName, setuserName, className }) {
  return (
    <div className={className}>
      <label className="input-label">User Name</label>
      <input
        type="string"
        value={userName}
        onChange={(e) => setuserName(e.target.value)}
        className="input-field"
        required
      />
    </div>
  );
}

export default UsernameInput;