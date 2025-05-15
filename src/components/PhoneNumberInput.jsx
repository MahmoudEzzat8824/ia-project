import '../styles/auth/components/inputs.css'; 

function PhoneNumberInput({ phoneNumber, setPhoneNumber, className }) {
    return (
      <div className={className}>
        <label className="input-label">Phone Number</label>
        <input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          className="input-field"
          required
        />
      </div>
    );
  }
  
  export default PhoneNumberInput;