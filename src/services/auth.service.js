import axios from "axios";

const API_URL = "https://localhost:7200";

const AdminLogin = (adminName, passwordHash) => {
  return axios
    .post(`${API_URL}/api/admin/login`, {
      adminName,
      passwordHash,
    })
    .then((response) => {
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
    })
    .catch((error) => {
      console.error("Login API error:", error);
      throw error;
    });
};

const BookOwnerLogin = (bookOwnerName, password) => {
  return axios
    .post(`${API_URL}/api/bookowner/login`, {
      bookOwnerName,
      password,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem(
          "token",
          JSON.stringify({
            token: response.data.token,
            role: "book_owner"
          })
        );
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Login API error:", error);
      throw error;
    });
};

const ReaderLogin = (readerName, password) => {
  return axios
    .post(`${API_URL}/api/reader/login`, {
      readerName,
      password,
    })
    .then((response) => {
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
    })
    .catch((error) => {
      console.error("Login API error:", error);
      throw error;
    });
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
