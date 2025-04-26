import Login from './pages/Login';
import Signup from './pages/Signup';
import BookPost from './components/BookPost';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import AdminDashboard from './pages/AdminDashboard';
import BookOwnerPage from './pages/BookOwnerPage';
import Search from './components/search';
import HomePageWithoutLogin from './pages/HomePageWithoutLogin';
import BookDetailsPage from './pages/BookDetailsPage';
import HomePageWithLogin from './pages/HomePageWithLogin';

function App() {


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageWithoutLogin />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/bookpost" element={<BookPost />} />
        <Route path="/ProfilePage" element={<ProfilePage />} />
        <Route path="/EditProfilePage" element={<EditProfilePage />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/BookOwnerPage" element={<BookOwnerPage />} />
        <Route path="/Search" element={<Search />} />
        <Route path='/login' element={<Login />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />
        <Route path="/HomePageWithLogin" element={<HomePageWithLogin />} />
      </Routes>
    </Router>
  );
}

export default App;