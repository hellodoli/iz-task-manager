import api from "./index";

class User {
  async signUp(user) {
    try {
      const response = await api.post("/users", user);
      return response.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default User;
