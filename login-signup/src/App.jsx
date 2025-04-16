import { useState } from 'react';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const [page, setPage] = useState('login');

  return (
    <div className="app-container">
      {page === 'login' ? <Login setPage={setPage} /> : <Signup setPage={setPage} />}
    </div>
  );
}

export default App;