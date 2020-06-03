import api from './index';
import { getCookie } from '../utils/cookies';

class Task {
  constructor() {
    this.tasks = [];
    this.isUpdateSuccess = null;
    this.isDeleteSuccess = null;
    this.isDragSuccess = null;
    this.newTask = null;
  }

  async getAllTask(schedule) {
    try {
      this.tasks = [];
      let params = {};
      // options schedule
      if (typeof schedule !== 'undefined') params = { schedule };

      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + getCookie('emailToken'),
      };

      const response = await api.get('/tasks', { params, headers });
      if (response.status === 200) this.tasks = response.data;
    } catch (error) {
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }

  async updateTask(obTask) {
    try {
      this.isUpdateSuccess = null;
      const { id, ...updateInfo } = obTask;
      const url = '/tasks/' + id;
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + getCookie('emailToken'),
      };
      const response = await api.patch(url, { ...updateInfo }, { headers });
      if (response.status === 200) {
        this.isUpdateSuccess = true;
      } else {
        this.isUpdateSuccess = false;
      }
    } catch (error) {
      this.isUpdateSuccess = false;
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }

  async addTask(obTask) {
    try {
      this.newTask = null;
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + getCookie('emailToken'),
      };

      if (typeof obTask.section === 'undefined' || obTask.section === '')
        obTask.section = null;

      if (typeof obTask.schedule === 'undefined' || obTask.schedule === '')
        obTask.schedule = null;

      const response = await api.post('/tasks', { ...obTask }, { headers });
      console.log(response);
      if (response.status === 201) {
        this.newTask = response.data;
      }
    } catch (error) {
      this.newTask = null;
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }

  async deleteTask(id) {
    try {
      this.isDeleteSuccess = null;
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + getCookie('emailToken'),
      };

      const url = '/tasks/' + id;
      const response = await api.delete(url, { headers });
      console.log(response);
      if (response.status === 200) {
        this.isDeleteSuccess = true;
      } else {
        this.isDeleteSuccess = false;
      }
    } catch (error) {
      this.isDeleteSuccess = false;
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }

  /*
   * arrTask: array source Task and destination Task
   */
  async updateManyTask(arrTask) {
    try {
      this.isDragSuccess = null;
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + getCookie('emailToken'),
      };

      const response = await api.patch('/many', { arrTask }, { headers });
      console.log(response);
      if (response.status === 200) this.isDragSuccess = true;
      else this.isDragSuccess = false;
    } catch (error) {
      this.isDragSuccess = false;
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }
}

export default Task;
