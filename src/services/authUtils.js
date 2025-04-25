export const getLoggedInUser = () => {
  const raw = localStorage.getItem("token");
  if (!raw) return null;

  try {
    const { role, token } = JSON.parse(raw);
    
    // decode JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));
    
    return {
      role,
      token,
      readerName: payload.name,
      readerID: payload.readerId,
    };
  } catch (e) {
    console.error("Invalid token in localStorage", e);
    return null;
  }
};
