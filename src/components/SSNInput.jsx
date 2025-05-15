import React from 'react';
import '../styles/auth/components/inputs.css'; 

function SSNInput({ ssn, setSsn, className }) {
  return (
    <div className={className}>
      <label htmlFor="ssn" className="block mb-1">
        SSN
      </label>
      <input
        type="string"
        id="ssn"
        value={ssn}
        onChange={(e) => setSsn(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}

export default SSNInput;