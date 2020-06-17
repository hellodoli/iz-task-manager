import api from './index';
import { getCookie } from '../utils/cookies';
import { useLoading } from '../hooks/loading';

class Section {
  constructor() {
    this.sections = [];
    this.isAddSuccess = null;
    this.dataAfterAdd = {};
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

  async addSection(obSection) {
    try {
      //setLoading(true);
      this.isAddSuccess = null;
      this.dataAfterAdd = {};
      const headers = {
        Accept: 'application/json',
        Authorization: 'Bearer ' + getCookie('emailToken'),
      };
      const response = await api.post(
        '/sections',
        { ...obSection },
        { headers }
      );
      if (response.status === 201) {
        this.isAddSuccess = true;
        this.dataAfterAdd = response.data;
      }
      //setLoading(false);
    } catch (error) {
      this.isAddSuccess = false;
      this.dataAfterAdd = {};
      console.log(error);
      console.log('error.name: ', error.name);
      console.log('error.message: ', error.message);
    }
  }
}

export default Section;
