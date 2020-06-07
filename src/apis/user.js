import api from './index';
import { getCookie } from '../utils/cookies';

class User {
  constructor() {
    this.newUserInfo = {};
    this.dataLogin = {};
    this.dataSetup = {};
    this.isUpdateUserSuccess = null;
  }

  async signUp(user) {
    try {
      this.newUserInfo = {};
      const response = await api.post('/users', user);
      console.log(response);
      if (response.status === 201) {
        this.newUserInfo = response.data;
      } else {
        this.newUserInfo = {};
      }
    } catch (error) {
      this.newUserInfo = {};
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }

  async signIn(user) {
    try {
      this.dataLogin = {};
      const response = await api.post('/users/login', user);
      console.log('/users/login : ', response);
      if (response.status === 200) {
        this.dataLogin = response.data;
      } else {
        this.dataLogin = {};
      }
    } catch (error) {
      this.dataLogin = {};
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }

  async getUser(token) {
    try {
      this.dataSetup = {};
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + token,
      };
      const response = await api.get('/users/me', { headers });
      console.log(response);
      if (response.status === 200) {
        this.dataSetup = response.data;
      } else {
        this.dataSetup = {};
      }
    } catch (error) {
      this.dataSetup = {};
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }

  async editUser(obUser) {
    try {
      this.isUpdateUserSuccess = null;
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + getCookie('emailToken'),
      };
      const response = await api.patch('/users/me', { ...obUser }, { headers });
      if (response.status === 200) {
        this.isUpdateUserSuccess = true;
      } else {
        this.isUpdateUserSuccess = false;
      }
    } catch (error) {
      this.isUpdateUserSuccess = false;
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }
}

export default User;
