import task from "./index";

class Users {
  async signUp(user) {
    try {
      console.log(user);
      const response = await task.post("/users", user);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }
}

export default Users;
