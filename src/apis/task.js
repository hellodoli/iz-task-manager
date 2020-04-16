import api from './index';

class Task {
  constructor() {
    this.tasks = [];
  }

  async getAllTask(token, schedule) {
    try {
      let params = {};
      if (typeof schedule !== 'undefined') params = { schedule };

      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      };

      const response = await api.get('/tasks', { params, headers });
      console.log(response);
      if (response.status === 200) {
        this.tasks = response.data;
      } else {
        this.tasks = [];
      }
    } catch (error) {
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }
}

export default Task;
