import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Ensure SignalR is available
const signalR = window.signalR;

const API_URL = "https://localhost:7200";

let readerIdToShow = null;
let readerNameToShow = null;
let readerEmailToShow = null;

// SignalR Connection Setup
let connection = null;
let isStarting = false; // Flag to prevent multiple start attempts

const initializeSignalR = () => {
  if (connection) return;

  const token = JSON.parse(localStorage.getItem("token"))?.token;
  if (!token) {
    console.error("No token found for SignalR connection");
    return;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_URL}/notificationHub`, {
      accessTokenFactory: () => token,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .configureLogging(signalR.LogLevel.Debug)
    .build();

  // Handle incoming notifications
  connection.on("ReceiveNotification", (message) => {
  if (message === "Test notification") return; // Remove or ignore it
  console.log("Notification received:", message);
  const event = new CustomEvent("notificationReceived", { detail: message });
  window.dispatchEvent(event);
});


  // Handle connection close
  connection.onclose(async (error) => {
    console.error("SignalR connection closed:", error);
    if (!isStarting) {
      await startSignalR();
    }
  });
};

const startSignalR = async () => {
  if (isStarting) {
    console.log("SignalR start already in progress");
    return;
  }

  if (!connection) {
    initializeSignalR();
  }

  // Check connection state
  if (connection.state !== signalR.HubConnectionState.Disconnected) {
    console.log(`SignalR connection is in ${connection.state} state, cannot start`);
    return;
  }

  isStarting = true;
  try {
    await connection.start();
    console.log("SignalR Connected.");
  } catch (err) {
    console.error("SignalR Connection failed:", err.message);
    // Retry after delay, but only if not already starting
    setTimeout(async () => {
      if (!isStarting) {
        await startSignalR();
      }
    }, 5000);
  } finally {
    isStarting = false;
  }
};

const stopSignalR = async () => {
  if (connection && connection.state !== signalR.HubConnectionState.Disconnected) {
    try {
      await connection.stop();
      console.log("SignalR Disconnected.");
    } catch (err) {
      console.error("SignalR Disconnection failed:", err.message);
    }
  }
  connection = null;
  isStarting = false;
};

// Admin Login
const AdminLogin = async (adminName, passwordHash) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/admin/admin/login`,
      { adminName, passwordHash },
      { withCredentials: true }
    );

    if (response.data.token) {
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: response.data.token,
          role: "admin",
        })
      );
      // Initialize and start SignalR after successful login
      await stopSignalR(); // Ensure any existing connection is stopped
      initializeSignalR();
      await startSignalR();
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

// Create Admin
const createAdmin = async (adminName, passwordHash) => {
  try {
    if (!adminName || !passwordHash) {
      throw new Error("adminName and passwordHash are required");
    }

    const tokenData = localStorage.getItem("token");
    if (!tokenData) {
      throw new Error("No token found");
    }

    let token;
    try {
      token = JSON.parse(tokenData)?.token;
    } catch (e) {
      throw new Error("Invalid token format");
    }

    if (!token) {
      throw new Error("Token is missing");
    }

    const response = await axios.post(
      `${API_URL}/api/admin/create`,
      { adminName, passwordHash },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Create Admin API error:", error.response.data);
      throw new Error(error.response.data.message || "Failed to create admin");
    } else if (error.request) {
      console.error("Create Admin API error: No response received", error.request);
      throw new Error("No response from server");
    } else {
      console.error("Create Admin API error:", error.message);
      throw new Error(error.message);
    }
  }
};

// Book Owner Login
const BookOwnerLogin = async (bookOwnerName, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/bookowner/login`,
      { bookOwnerName, password },
      { withCredentials: true }
    );

    if (response.data.token) {
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: response.data.token,
          role: "book_owner",
          bookOwnerID: response.data.user.bookOwnerID,
        })
      );
      // Initialize and start SignalR after successful login
      await stopSignalR();
      initializeSignalR();
      await startSignalR();
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

// Reader Login
const ReaderLogin = async (readerName, password) => {
  try {
    const response = await axios.post(
      `${API_URL}/api/reader/reader/login`,
      { readerName, password },
      { withCredentials: true }
    );

    if (response.data.token) {
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: response.data.token,
          role: "reader",
          readerID: response.data.user.readerID,
          readerName: response.data.user.readerName,
          readerEmail: response.data.user.email,
        })
      );
      // Initialize and start SignalR after successful login
      await stopSignalR();
      initializeSignalR();
      await startSignalR();
    }

    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

// Logout
const Logout = async () => {
  await stopSignalR();
  localStorage.removeItem("token");
};

// Fetch Book Owners
const fetchBookOwners = async () => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/api/admin/ManageBookOwners`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Fetch Book Owners API error:", error);
    throw error;
  }
};

// Handle Action
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
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedResponse = await axios.get(`${API_URL}/api/admin/ManageBookOwners`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return updatedResponse.data;
  } catch (error) {
    console.error(`Process Book Owner API error (${action}):`, error);
    throw error;
  }
};

// Search Books
const searchBooks = async (params) => {
  const queryParams = Object.entries(params)
    .filter(([_, value]) => value && value.trim() !== "")
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/api/BookPost/Search?${queryParams}`, { headers });
    return response.data;
  } catch (error) {
    console.warn("Error searching books:", error.response?.data || error.message);
    throw error;
  }
};

// Check Book Availability
const checkBookAvailability = async (bookPostId) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }
    if (!bookPostId) {
      throw new Error("Invalid bookPostId");
    }
    const response = await axios.get(`${API_URL}/api/BookPost/available/${bookPostId}`, {
      headers: {
        "Content-Type": "application/json",
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

// Get Book Details
const getBookDetails = async (bookPostId) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const response = await axios.get(`${API_URL}/api/BookPost/${bookPostId}`, { headers });
    return response.data;
  } catch (error) {
    console.warn(`Error fetching book details for ${bookPostId}:`, error.response?.data || error.message);
    throw error;
  }
};

// Fetch Borrow Requests
const fetchBorrowRequests = async (readerID) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/api/reader/user/${readerID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Raw Borrow Requests API Response:", response.data);
    return Array.isArray(response.data) ? response.data : response.data.borrowRequests || [];
  } catch (error) {
    console.error("Fetch Borrow Requests API error:", error);
    throw error;
  }
};

// Return Book
const returnBook = async (requestID, bookPostID, readerID) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${API_URL}/api/reader/return`,
      {
        requsetID: requestID,
        bookPostID: bookPostID,
        readerID: readerID,
        requsetStatus: "returned",
      },
      {
        headers: {
          "Content-Type": "application/json",
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

// Fetch Book Posts by Owner
const fetchBookPostsByOwner = async (bookOwnerID, signal) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/api/bookowner/owner?bookOwnerId=${bookOwnerID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch Book Posts
const fetchBookPosts = async (bookOwnerID, signal) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/api/bookowner/posts/${bookOwnerID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal,
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Accept Request
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
        RequsetStatus: "Accepted",
      },
      {
        headers: {
          "Content-Type": "application/json",
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

// Reject Request
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
        RequsetStatus: "Rejected",
      },
      {
        headers: {
          "Content-Type": "application/json",
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

// Parse JWT
function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    const decodedPayload = atob(base64Payload);
    return JSON.parse(decodedPayload);
  } catch (e) {
    return null;
  }
}

// Check Token Expiry
function isTokenExpiringSoon(token) {
  const payload = parseJwt(token);
  if (!payload || !payload.exp) return false;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp - now <= 120;
}

// Refresh Token
const refreshTokenIfNeeded = async () => {
  console.log("Checking token for refresh...");
  const tokenStr = localStorage.getItem("token");
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
    const now = Date.now() / 1000;

    if (exp - now < 60) {
      console.log("Token expired or expiring soon. Refreshing...");

      const response = await axios.post(
        `${API_URL}/api/RefreshToken/refresh-token`,
        null,
        { withCredentials: true }
      );

      const newToken = response.data?.token;
      if (newToken) {
        console.log("New token received:", newToken);
        const newDecoded = jwtDecode(newToken);

        tokenObj.token = newToken;
        localStorage.setItem("token", JSON.stringify(tokenObj));

        const newExp = newDecoded.exp;
        const maxAge = newExp - Math.floor(Date.now() / 1000);
        document.cookie = `refreshToken=${newToken}; path=/; max-age=${maxAge}; secure`;

        // Reinitialize SignalR with new token
        await stopSignalR();
        initializeSignalR();
        await startSignalR();
      } else {
        console.warn("No token received in the refresh response.");
      }
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
  }
};

// Add Like
const addLike = async (readerID, bookPostID, isLike) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.post(
      `${API_URL}/api/reader/like`,
      { readerID, bookPostID, isLike },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Add Like API error:", error);
    throw error;
  }
};

// Update Like
const updateLike = async (readerID, bookPostID, isLike) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.put(
      `${API_URL}/api/reader/like`,
      { readerID, bookPostID, isLike },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Update Like API error:", error);
    throw error;
  }
};

// Remove Like
const removeLike = async (readerID, bookPostID, isLike) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.delete(
      `${API_URL}/api/reader/like`,
      {
        data: { readerID, bookPostID, isLike },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Remove Like API error:", error);
    throw error;
  }
};

// Check Like
const checkLike = async (readerID, bookPostID) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(
      `${API_URL}/api/reader/check-like?readerID=${readerID}&bookPostID=${bookPostID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Check Like API error:", error);
    throw error;
  }
};

const updateBookPost = async (postId, updatedData, token) => {
  try {
    // Log the FormData contents for debugging
    console.log('Sending updateBookPost request with postId:', postId);
    for (let [key, value] of updatedData.entries()) {
      console.log(`${key}: ${value instanceof File ? 'File' : value}`);
    }

    const response = await axios.put(
      `${API_URL}/api/bookowner/updateBookPost/${postId}`,
      updatedData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error editing book post:', error);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
    throw error;
  }
};

const deleteBookPost = async (postId, token) => {
  try {
    const response = await axios.delete(
      `${API_URL}/api/bookowner/${postId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting book post:", error);
    throw error;
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
  refreshTokenIfNeeded,
  addLike,
  updateLike,
  removeLike,
  checkLike,
  startSignalR,
  stopSignalR,
  updateBookPost,
  deleteBookPost,
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
      };
    }
    return {
      bookOwnerId: null,
      bookOwnerName: null,
    };
  },
};

export default authService;