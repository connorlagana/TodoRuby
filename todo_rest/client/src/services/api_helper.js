import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3000"
});
// AUTH
// LOGIN
export const loginUser = async loginData => {
  const resp = await api.post("/auth/login", loginData);
  api.defaults.headers.common.authorization = `Bearer ${resp.data.auth_token}`;
  localStorage.setItem("authToken", resp.data.auth_token);
  localStorage.setItem("name", resp.data.user.name);
  localStorage.setItem("email", resp.data.user.email);
  return resp.data.user;
};
// REGISTER
export const registerUser = async registerData => {
  try {
    const resp = await api.post("/signup", registerData);
    api.defaults.headers.common.authorization = `Bearer ${resp.data.auth_token}`;
    localStorage.setItem("authToken", resp.data.auth_token);
    localStorage.setItem("name", resp.data.user.name);
    localStorage.setItem("email", resp.data.user.email);
    return resp.data.user;
  } catch (e) {
    console.log(e.response);
    if (e.response.status === 422) {
      return { errorMessage: "emial is already in use" };
    }
  }
};
// VERIFY USER
export const verifyUser = () => {
  const token = localStorage.getItem("authToken");
  if (token) {
    api.defaults.headers.common.authorization = `Bearer ${token}`;
  }
};
// TODOS
// GET ALL TODOS
export const indexTodos = async () => {
  const resp = await api.get("/todos");
  return resp.data;
};
//POST THE TODO
export const postTodo = async postData => {
  const resp = await api.post("/todos", postData);
  return resp.data;
};
