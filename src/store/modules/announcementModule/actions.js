import axios from 'axios';
import { Cookies } from 'quasar';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + 'announcement';

export default {

  async fetchAnnouncements({ commit, dispatch }) {
    try {
      const response = await axios.get(`${api}${controllerName}/getAnnouncements`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      commit('SET_ANNOUNCEMENTS', response.data);
    } catch (error) {
      console.error('Error Fetching Announcement', error);
      
      // if (error.response.status === 403) {
      //   await dispatch('handle403Error');
      // };
      throw error;
    }
  },


};