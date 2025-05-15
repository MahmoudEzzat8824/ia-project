import '../styles/auth/components/buttons.css'; 

function SubmitButton({ handleLogin }) {
    return (
      <button
        onClick={handleLogin}
        className="submit-button login-button"
      >
        Login
      </button>
    );
  }
  
  export default SubmitButton;