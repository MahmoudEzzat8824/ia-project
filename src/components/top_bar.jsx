import website_logo from '../assets/website_logo.png';
import authService from '../services/auth.service';

function TopBar() {
    return (
        <div className="top_bar flex flex-col md:flex-row items-center justify-between p-4">
            <div className="flex items-center gap-4">
                <img src={website_logo} alt="BookSwap logo" className="web_logo" />
                <a className="website_name" href="/">BookSwap</a>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-4 md:mt-0">
                <div className="flex gap-4">
                    {/* <a className="TopBarProfilePageLink" href="/ProfilePage">Profile</a> */}
                    <a className="TopBarProfilePageLink" href="/search">Search</a>
                    <a className="logoutButton" href="/" onClick={authService.Logout}>Log Out</a>
                </div>
            </div>
        </div>
    );
}

export default TopBar;