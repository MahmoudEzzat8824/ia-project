import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import '../styles/auth/components/inputs.css'; 
import '../styles/auth/components/forms.css'; 

function PasswordInput({ password, setPassword, showPassword, setShowPassword, className }) {
  return (
    <div className={`password-input-group ${className}`}>
      <label htmlFor="password" className="input-label">
        Password
      </label>
      <div className="relative">
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field"
          required
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="password-toggle"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeSlashIcon className="icon" />
          ) : (
            <EyeIcon className="icon" />
          )}
        </button>
      </div>
    </div>
  );
}

export default PasswordInput;