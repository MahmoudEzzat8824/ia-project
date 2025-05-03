import { Link } from 'react-router-dom';
import website_logo from '../assets/website_logo.png';
import authService from '../services/auth.service';

function TopBar() {
  const hasToken = !!localStorage.getItem('token');

  const getUserRole = () => {
    try {
      const rawToken = localStorage.getItem('token');
      if (!rawToken) return null;
      const parsed = JSON.parse(rawToken);
      return parsed.role || null; // Assuming role is stored in token
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };

  const userRole = getUserRole();
  const isReader = userRole === 'reader';
  const isBookOwner = userRole === 'book_owner';

  return (
    <div className="top_bar flex flex-col md:flex-row items-center justify-between p-4">
      <div className="flex items-center gap-4">
        <img src={website_logo} alt="BookSwap logo" className="web_logo" />
        <Link
          className="website_name"
          to={
            isBookOwner ? '/HomePageWithLogin' :
            isReader ? '/HomePageWithLogin' :
            '/login'
          }
        >
          BookSwap
        </Link>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
        <div className="flex gap-4">
          {isReader && (
            <Link className="TopBarProfilePageLink" to="/ProfilePage">
              Profile
            </Link>
          )}
          {isBookOwner && (
            <Link className="TopBarProfilePageLink" to="/BookOwnerPage">
              Profile
            </Link>
          )}
          {hasToken && (
          <Link className="TopBarProfilePageLink" to="/search">
            Search
          </Link>
          )}
          {hasToken && (
            <Link
              className="logoutButton"
              to="/login"
              onClick={authService.Logout}
            >
              Log Out
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopBar;