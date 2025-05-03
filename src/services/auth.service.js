import axios from "axios";
import { data } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const API_URL = "https://localhost:7200";


const AdminLogin = async (adminName, passwordHash) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/login`,
      { adminName, passwordHash },
      {
        withCredentials: true // ⬅️ This is required for sending/receiving cookies
      }
    );

    const response = await axios.post(`${API_URL}/api/admin/login`, {
      adminName,
      passwordHash,
    });
    if (response.data.token) {
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: response.data.token,
          role: "admin"
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};


const createAdmin = async (adminName, passwordHash) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${API_URL}/api/admin/create`,
      {
        adminName,
        passwordHash,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Create Admin API error:", error);
    throw error;
  }
};

const BookOwnerLogin = async (bookOwnerName, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/bookowner/login`,
      {
        bookOwnerName,
        password,
      },
      {
        withCredentials: true // ⬅️ Required for sending/receiving cookies
      }
    );

    if (response.data.token) {
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: response.data.token,
          role: "book_owner",
          bookOwnerID: response.data.user.bookOwnerID
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};


const ReaderLogin = async (readerName, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/reader/login`,
      {
        readerName,
        password,
      },
      {
        withCredentials: true // ⬅️ Enables sending/receiving cookies
      }
    );

    if (response.data.token) {
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: response.data.token,
          role: "reader",
          readerID: response.data.user.readerID,
          readerName: response.data.user.readerName,
          readerEmail: response.data.user.email
        })
      );
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};



const Logout = () => {
  localStorage.removeItem("token");
};

const fetchBookOwners = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/api/admin/ManageBookOwners`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Fetch Book Owners API error:", error);
    throw error;
  }
};

const handleAction = async (id, action) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    await axios.put(
      `${API_URL}/api/admin/ProcessBookOwner/${id}?action=${action}`,
      null,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Refetch book owners after the action
    const updatedResponse = await axios.get(`${API_URL}/api/admin/ManageBookOwners`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return updatedResponse.data;
  } catch (error) {
    console.error(`Process Book Owner API error (${action}):`, error);
    throw error;
  }
};

const searchBooks = async (params) => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value && value.trim() !== '')
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  try {
    const token = JSON.parse(localStorage.getItem('token'))?.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/api/BookPost/Search?${queryParams}`, { headers });
    return response.data;
  } catch (error) {
    console.warn('Error searching books:', error.response?.data || error.message);
    throw error;
  }
};

const checkBookAvailability = async (bookPostId) => {
  try {
    const token = JSON.parse(localStorage.getItem('token'))?.token;
    if (!token) {
      throw new Error('No token found');
    }
    if (!bookPostId) {
      throw new Error('Invalid bookPostId');
    }
    const response = await axios.get(`${API_URL}/api/BookPost/available/${bookPostId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.available;
  } catch (error) {
    if (error.response?.status === 404) {
      return false;
    }
    console.warn(`Check Book Availability API warning for book ${bookPostId}:`, error.response?.data || error.message);
    throw error;
  }
};

const getBookDetails = async (bookPostId) => {
  try {
    const token = JSON.parse(localStorage.getItem('token'))?.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/api/BookPost/${bookPostId}`, { headers });
    return response.data;
  } catch (error) {
    console.warn(`Error fetching book details for ${bookPostId}:`, error.response?.data || error.message);
    throw error;
  }
};

const fetchBorrowRequests = async (readerID) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/api/reader/user/${readerID}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw Borrow Requests API Response:", response.data);

    // Handle different possible response structures
    return Array.isArray(response.data) 
      ? response.data 
      : response.data.borrowRequests || [];
  } catch (error) {
    console.error("Fetch Borrow Requests API error:", error);
    throw error;
  }
};

const returnBook = async (requestID, bookPostID, readerID) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${API_URL}/api/reader/return`,
      {
        requsetID: requestID, // Use requsetID as per schema
        bookPostID: bookPostID,
        readerID: readerID,
        requsetStatus: "returned" // Use requsetStatus as per schema
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Return Book API error:", error);
    throw error;
  }
};

const fetchBookPostsByOwner = async (bookOwnerID, signal) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/api/bookowner/owner?bookOwnerId=${bookOwnerID}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const fetchBookPosts = async (bookOwnerID, signal) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/api/bookowner/posts/${bookOwnerID}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

const acceptRequest = async (requestId, bookPostId, readerId) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${API_URL}/api/bookowner/respond`,
      {
        requsetID: requestId,
        bookPostID: bookPostId,
        readerID: readerId,
        RequsetStatus: "Accepted" // Changed to match the server's expected field name
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Request failed with status code ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

const rejectRequest = async (requestId, bookPostId, readerId) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${API_URL}/api/bookowner/respond`,
      {
        requsetID: requestId,
        bookPostID: bookPostId,
        readerID: readerId,
        RequsetStatus: "Rejected" // Changed to match the server's expected field name
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(`Request failed with status code ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

const updateBookPost = async (bookPostId, formData) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    console.log('Updating book post at:', `${API_URL}/api/bookowner/UpdateBookPost/${bookPostId}`);
    console.log('FormData fields:', [...formData.entries()]);

    const response = await axios.put(
      `${API_URL}/api/bookowner/UpdateBookPost/${bookPostId}`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Update Book Post API error:", error);
    if (error.response) {
      throw new Error(`Request failed with status code ${error.response.status}: ${JSON.stringify(error.response.data)}`);
    }
    throw error;
  }
};

// Helper: Parse JWT and get expiry
function parseJwt(token) {
  try {
    const base64Payload = token.split('.')[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch (e) {
    return null;
  }
}

// Helper: Check if token expires within next 2 minutes
function isTokenExpiringSoon(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now <= 120; // 2 minutes = 120 seconds
}

// Function: Refresh token and update storage/cookies
const refreshTokenIfNeeded = async () => {
  
  console.log("Token expired or expiring soon. Refreshing...");
  const tokenStr = localStorage.getItem('token');
  if (!tokenStr) {
    console.error("No token found in localStorage.");
    return;
  }

  const tokenObj = JSON.parse(tokenStr);
  const token = tokenObj.token;

  if (!token) {
    console.error("Token not found in token object.");
    return;
  }

  try {
    const decoded = jwtDecode(token);
    const exp = decoded.exp;
    const now = Date.now() / 1000; // current time in seconds

    // Refresh if token expires within 60 seconds
    if (exp - now < 60) {
      console.log("Token expired or expiring soon. Refreshing...");

      const response = await await axios.post(
        "https://localhost:7200/api/RefreshToken/refresh-token",
        null,
        { withCredentials: true }
      );
      
      // Ensure the response contains the new token
      const newToken = response.data?.token;
      console.log("New token received:", newToken);
      if (newToken) {
        console.log("New token received:", newToken);
        const newDecoded = jwtDecode(newToken);

        // Update token object
        tokenObj.token = newToken;
        localStorage.setItem('token', JSON.stringify(tokenObj));

        // Set cookie with proper max-age
        const newExp = newDecoded.exp;
        const maxAge = newExp - Math.floor(Date.now() / 1000); // in seconds
        document.cookie = `refreshToken=${newToken}; path=/; max-age=${maxAge}; secure`;
      } else {
        console.warn("No token received in the refresh response.");
      }
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
};





const authService = {
  AdminLogin,
  createAdmin,
  BookOwnerLogin,
  ReaderLogin,
  Logout,
  fetchBookOwners,
  handleAction,
  searchBooks,
  checkBookAvailability,
  getBookDetails,
  fetchBorrowRequests,
  returnBook,
  fetchBookPostsByOwner,
  fetchBookPosts,
  acceptRequest,
  rejectRequest,
  updateBookPost,
  addLike,
  updateLike,
  removeLike,
  checkLike,
  refreshTokenIfNeeded,
  getReaderDetails: () => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    if (tokenData && tokenData.role === "reader") {
      return {
        readerId: tokenData.readerID || null,
        readerName: tokenData.readerName || null,
        readerEmail: tokenData.readerEmail || null,
      };
    }
    return {
      readerId: null,
      readerName: null,
      readerEmail: null,
    };
  },
  getBookOwnerDetails: () => {
    const tokenData = JSON.parse(localStorage.getItem("token"));
    if (tokenData && tokenData.role === "book_owner") {
      return {
        bookOwnerId: tokenData.bookOwnerID || null,
        bookOwnerName: tokenData.bookOwnerName || null,
        // readerEmail: tokenData.bookOwnerEmail || null,
      };
    }
    return {
      bookOwnerId: null,
      bookOwnerName: null,
      // readerEmail: null,
    };
  }
};

export default authService;