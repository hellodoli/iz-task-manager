import api from './index';
import { getCookie } from '../utils/cookies';

class Section {
  constructor() {
    this.sections = [];
  }

  async getAllSection() {
    try {
      this.sections = [];
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + getCookie('emailToken'),
      };
      const response = await api.get('/sections', { headers });
      if (response.status === 200) this.sections = response.data;
    } catch (error) {
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }
}

export default Section;
