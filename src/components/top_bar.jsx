import website_logo from '../assets/website_logo.png';

function TopBar() {
    return (
        <>
            <div className="top_bar">
                <a className="website_name" href="/">BookSwap</a>
                <img src={website_logo} alt="BookSwap logo" className='web_logo'/>
            </div>
        </>
        
    );
}

export default TopBar;