import api from './index';

class Task {
  constructor() {
    this.tasks = [];
    this.isUpdateSuccess = null;
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

  async updateTask(token, obTask) {
    try {
      this.isUpdateSuccess = null;
      const { id, ...updateInfo } = obTask;
      const url = '/tasks/' + id;
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token
      };
      const response = await api.patch(url, { ...updateInfo }, { headers });
      if (response.status === 200) {
        this.isUpdateSuccess = true;
      } else {
        this.isUpdateSuccess = false;
      }
    } catch (error) {
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }
}

export default Task;
