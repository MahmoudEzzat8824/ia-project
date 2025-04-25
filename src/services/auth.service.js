import axios from "axios";

const API_URL = "https://localhost:7200";

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
    const response = await axios
      .post(`${API_URL}/api/reader/login`, {
        readerName,
        password,
      });
    if (response.data.token) {
      localStorage.setItem(
        "token",
        JSON.stringify({
          token: response.data.token,
          role: "reader",
          readerID : response.data.user.readerID
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

const authService = {
  AdminLogin,
  BookOwnerLogin,
  ReaderLogin,
  Logout,
  fetchBookOwners,
  handleAction,
};

export default authService;