import api from './index';

class User {
  constructor() {
    this.newUserInfo = {};
    this.dataLogin = {};
    this.dataSetup = {};
  }

  async signUp(user) {
    try {
      const response = await api.post('/users', user);
      console.log(response);
      if (response.status === 201) {
        this.newUserInfo = response.data;
      } else {
        this.newUserInfo = {};
      }
    } catch (error) {
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }

  async signIn(user) {
    try {
      const response = await api.post('/users/login', user);
      console.log(response);
      if (response.status === 200) {
        this.dataLogin = response.data;
      } else {
        this.dataLogin = {};
      }
    } catch (error) {
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }

  async getUser(token) {
    try {
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
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }
}

export default User;
