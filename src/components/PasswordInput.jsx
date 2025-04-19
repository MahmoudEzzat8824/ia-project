import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

function PasswordInput({ password, setPassword, showPassword, setShowPassword, className }) {
  return (
    <div className={className}>
      <label className="input-label">Password</label>
      <input
        type={showPassword ? 'text' : 'password'}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field pr-10"
        placeholder="••••••••"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="password-toggle"
      >
        {showPassword ? <EyeSlashIcon className="icon" /> : <EyeIcon className="icon" />}
      </button>
    </div>
  );
}

export default PasswordInput;