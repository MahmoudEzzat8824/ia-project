import axios from "axios";

const API_URL = "https://localhost:7200";

const formLogin = (adminName, passwordHash) => {
  return axios
    .post(`${API_URL}/api/admin/login`, {
      adminName,
      passwordHash,
    })
    .then((response) => {
      if (response.data.token) {
        localStorage.setItem("token", JSON.stringify(response.data));
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Login API error:", error);
      throw error;
    });
};

const authService = {
  login: formLogin,
};

export default authService;