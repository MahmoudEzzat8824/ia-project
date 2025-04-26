import axios from "axios";
import { useState } from "react";

const API_URL = "https://localhost:7200";
let readerIdToShow = null;
let readerNameToShow = null;
let readerEmailToShow = null;

const AdminLogin = async (adminName, passwordHash) => {
  try {
    const response = await axios
      .post(`${API_URL}/api/admin/login`, {
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

const BookOwnerLogin = async (bookOwnerName, password) => {
  try {
    const response = await axios
      .post(`${API_URL}/api/bookowner/login`, {
        bookOwnerName,
        password,
      });
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
    const response = await axios.post(`${API_URL}/api/reader/login`, {
      readerName,
      password,
    });

    if (response.data.token) {
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: response.data.token,
          role: "reader",
          readerID: response.data.user.readerID,
          readerName: response.data.user.readerName, // Add this
          readerEmail: response.data.user.email       // Add this
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

const searchBooks = async (searchParams) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    // Create query string from non-empty search parameters
    const queryParams = Object.entries(searchParams)
      .filter(([_, value]) => value.trim() !== '')
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    const response = await axios.get(`${API_URL}/api/BookPost/Search?${queryParams}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Search Books API error:", error);
    throw error;
  }
};

const checkBookAvailability = async (bookPostId) => {
  try {
    const token = JSON.parse(localStorage.getItem("token"))?.token;
    if (!token) {
      throw new Error("No token found");
    }

    const response = await axios.get(`${API_URL}/api/BookPost/available/${bookPostId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data.available;
  } catch (error) {
    console.error(`Check Book Availability API error for book ${bookPostId}:`, error);
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



const authService = {
  AdminLogin,
  BookOwnerLogin,
  ReaderLogin,
  Logout,
  fetchBookOwners,
  handleAction,
  searchBooks,
  checkBookAvailability,
  fetchBorrowRequests,
  returnBook,
  fetchBookPostsByOwner,
  fetchBookPosts,
  acceptRequest,
  rejectRequest,
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
  }
};

export default authService;