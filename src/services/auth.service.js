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
          role: "reader"
        })
      );
    }
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};

const Logout = () =>{
  localStorage.removeItem("token");
};

const authService = {
  AdminLogin,
  BookOwnerLogin,
  ReaderLogin,
  Logout,
};

export default authService;
