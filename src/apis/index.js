import axios from "axios";

export default axios.create({
  baseURL: `https://iz-task-manager-api.herokuapp.com`
});
