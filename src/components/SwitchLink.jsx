import { Link } from 'react-router-dom';


function SwitchLink() {
  return (
    <p className="switch-text">
      Don't have an account?{' '}
      <Link to="/Signup">
        <button className="switch-link login-link">
          Sign Up
        </button>
      </Link>
    </p>
  );
}

export default SwitchLink;