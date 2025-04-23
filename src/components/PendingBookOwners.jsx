import React, { useState, useEffect } from 'react';
import authService from '../services/auth.service';


const PendingBookOwners = () => {
    const [bookOwners, setBookOwners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState({});
    const [actionError, setActionError] = useState({});
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await authService.fetchBookOwners();
          setBookOwners(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    const handleActionWrapper = async (id, action) => {
      setActionLoading(prev => ({ ...prev, [id]: true }));
      setActionError(prev => ({ ...prev, [id]: null }));
      try {
        const updatedData = await authService.handleAction(id, action);
        setBookOwners(updatedData);
      } catch (err) {
        setActionError(prev => ({ ...prev, [id]: err.message }));
      } finally {
        setActionLoading(prev => ({ ...prev, [id]: false }));
      }
    };
  
    const pendingOwners = bookOwners.filter(owner => owner.requestStatus.toLowerCase() === 'pending');
  
    return (
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Pending Book Owners</h2>
        {loading ? (
          <p className="text-gray-600 text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">Error: {error}</p>
        ) : pendingOwners.length === 0 ? (
          <p className="text-gray-600 text-center">No pending accounts to review.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b">ID</th>
                  <th className="py-2 px-4 border-b">Name</th>
                  <th className="py-2 px-4 border-b">SSN</th>
                  <th className="py-2 px-4 border-b">Email</th>
                  <th className="py-2 px-4 border-b">Phone</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingOwners.map((owner) => (
                  <tr key={owner.bookOwnerID} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{owner.bookOwnerID}</td>
                    <td className="py-2 px-4 border-b">{owner.bookOwnerName}</td>
                    <td className="py-2 px-4 border-b">{owner.ssn}</td>
                    <td className="py-2 px-4 border-b">{owner.email}</td>
                    <td className="py-2 px-4 border-b">{owner.phoneNumber}</td>
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleActionWrapper(owner.bookOwnerID, 'approve')}
                          disabled={actionLoading[owner.bookOwnerID]}
                          className={`px-3 py-1 rounded text-white ${
                            actionLoading[owner.bookOwnerID]
                              ? 'bg-green-300 cursor-not-allowed'
                              : 'bg-green-500 hover:bg-green-600'
                          }`}
                        >
                          {actionLoading[owner.bookOwnerID] ? 'Processing...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleActionWrapper(owner.bookOwnerID, 'reject')}
                          disabled={actionLoading[owner.bookOwnerID]}
                          className={`px-3 py-1 rounded text-white ${
                            actionLoading[owner.bookOwnerID]
                              ? 'bg-red-300 cursor-not-allowed'
                              : 'bg-red-500 hover:bg-red-600'
                          }`}
                        >
                          {actionLoading[owner.bookOwnerID] ? 'Processing...' : 'Reject'}
                        </button>
                      </div>
                      {actionError[owner.bookOwnerID] && (
                        <p className="text-red-500 text-sm mt-1">{actionError[owner.bookOwnerID]}</p>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
  };
  
  export default PendingBookOwners;