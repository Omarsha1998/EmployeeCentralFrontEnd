import axios from 'axios';
import { Cookies } from 'quasar';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + 'dtr';

export default {

  async fetchDTR({ commit }, dateData) {
    try {
      const response = await axios.get(`${api}${controllerName}/getDTRDetails`, 
      {
        params: dateData,
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
        
      });
  
      // Convert string representations to Date objects
      const dtrDetails = response.data.map(item => ({
        ...item,
        schedFrom: new Date(item.schedFrom),
        schedTo: new Date(item.schedTo),
        TimeIN: new Date(item.TimeIN)
      }));
  
      commit('SET_DTR_DETAILS', dtrDetails);
    } catch (error) {
      console.error('Error Fetching Announcement', error);
      throw error;
    }
  },


  async fetchNoDtrEmployee({ commit }) {
    try {
      const response = await axios.get(`${api}${controllerName}/no-dtr-employee`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`}
      })
      commit('SET_EMPLOYEE_NODTR', response.data)
    } catch (error) {
      console.error('Error Fetching Employee With No DTR', error);
      throw error;
    }
  }



};