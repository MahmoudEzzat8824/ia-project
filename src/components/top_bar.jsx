import website_logo from '../assets/website_logo.png';
import authService from '../services/auth.service';

function TopBar() {
    return (
        <div className="top_bar">
            <a className="website_name" href="/">BookSwap</a>
            <a className="TopBarProfilePageLink" href="/ProfilePage">Profile</a>
            <div className="search-container">
                <input type="text" className="search-input" placeholder="Search..." />
                <span className="search-icon">🔍</span>
            </div>
            <a className='logoutButton' href='/' onClick={authService.Logout}>Log Out</a>
            <img src={website_logo} alt="BookSwap logo" className="web_logo" />
        </div>
    );
}

export default TopBar;