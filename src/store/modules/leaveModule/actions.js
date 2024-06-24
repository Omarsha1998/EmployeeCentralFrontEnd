import axios from 'axios';
import { Cookies } from 'quasar';
import helperMethods from 'src/helperMethods';

const api = process.env.BACKEND_REST_API_URL;
const controllerName = helperMethods.getControllerBase() + 'leave';

export default {
  async submitLeaveRequest({ commit }, leaveRequestData) {
    try {
      const response = await axios.post(`${api}${controllerName}/leave-request`, leaveRequestData, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      
      commit('SET_LEAVE_DATA', response.data); 
    } catch (error) {
      console.error('Error Requesting Leaves', error);
      throw error;
    };
  },

  async deleteLeaves({ commit }, LeaveID) {
    try {
      await axios.delete(`${api}${controllerName}/delete-leave/${LeaveID}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
    } catch (error) {
      console.error('Error Deleting Leave Request', error);
      throw error;
    };
  },

  async updateLeaves({ commit }, updatedLeave ) {
    try {
      await axios.put(`${api}${controllerName}/editleave-request/${updatedLeave.editLeaveID}`, updatedLeave, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` 
        },
      });
      
      commit('SET_UPDATE_LEAVE', updatedLeave);
    } catch (error) {
      console.error('Error Updating Leaves', error);
      throw error;
    };
  },

  async fetchLeaves({ commit, dispatch }) {
    try {
      const response = await axios.get(`${api}${controllerName}/leave-details`, {
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
        },
      });

      commit('SET_LEAVE_DETAILS', response.data);
    } catch (error) {
      console.error('Error Fetching Leaves History', error);
      // if (error.response.status === 403) {
      //   await dispatch('handle403Error');
      // };
      throw error;
    }
  },

  async fetchApprovers({ commit, dispatch }) {
    try {
      const response = await axios.get(`${api}${controllerName}/approvers-details`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });

      commit('SET_APPROVERS_DETAILS', response.data);
    } catch (error) {
      console.error('Error fetching approvers details', error)
    }
  },

  async fetchleaveBalances({ commit, dispatch }) {
    try {
      const response = await axios.get(`${api}${controllerName}/leave-balance`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`},
      });
      commit('SET_BALANCE_DETAILS', response.data)
    } catch (error) {
      console.error('Error Getting User Leave Balance', error);

      // if (error.response.status === 403) {
      //   await dispatch('handle403Error');
      // };
      throw error;
    };
  },

  async fetchUserLeaveBalancesDetails({ commit, dispatch }, employeeID) {
    try {
      const response = await axios.get(`${api}${controllerName}/user-leave-balance/${employeeID}`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`},
      });
      commit('SET_BALANCE_USERBALANCEDETAILS', response.data)
    } catch (error) {
      console.error('Error on Getting Leave Balances', error);
      // if(error.response.status === 403) {
      //   await dispatch('handle403Error');
      // };
      throw error;
    };
  },

  async fetchForfeitedLeaves ({ commit, dispatch }) {
    try {
      const response = await axios.get(`${api}${controllerName}/forfeited-leave`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
  
      commit('SET_FORFEITED_DETAILS', response.data);
    } catch (error) {
      console.error('Error on getting Forfeited Leaves', error);
  
      // if (error.response.status === 403) {
      //   await dispatch('handle403Error');
      // };
      throw error;
    };
  },

  // async handle403Error({ commit, dispatch}) {
  //   console.error('Handling 403 error counter...');
  //   commit('INCREMENT_403_ERRORS');
  
  //   if (state.numberOf403Errors === 1) {
  //     try {
  //       await dispatch('auth/clearUserDetails', null, { root: true});
  //       commit('RESET_403_ERRORS');
  //     } catch (error) {
  //       console.log(error);
  //       throw error;
  //     };
  //   };
  // },
  
  async fetchpendingLeaves ({ commit, dispatch }) {
    try {
      const response = await axios.get(`${api}${controllerName}/pending-leaves`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      
      commit('SET_PENDING_DETAILS', response.data);
    } catch (error) {
      console.log('Error Getting Pending Leaves', error);
      // if (error.response.status === 403) {
      //   await dispatch('handle403Error');
      // };
      throw error;
    }
  },

  async fetchapprovedLeaves ({ commit, dispatch }) {
    try {
      const response = await axios.get(`${api}${controllerName}/approved-leaves`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      
      commit('SET_APPROVED_DETAILS', response.data);
    } catch (error) {
      console.log('Error Getting Approved Leaves', error);
      throw error;
    };
  },

  async fetchrejectedLeaves ({ commit, dispatch }) {
    try {
      const response = await axios.get(`${api}${controllerName}/rejected-leaves`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
      
      commit('SET_REJECTED_DETAILS', response.data);
    } catch (error) {
      console.log('Error Getting Rejected Leaves', error);
      // if (error.response.status === 403) {
      //   await dispatch('handle403Error');
      // };
      throw error;
    };
  },

  async fetchUserApprovedLeave ({ commit, dispatch }) {
    try {
      const response = await axios.get(`${api}${controllerName}/user-approved-leaves`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`},
      });

      commit('SET_USERAPPROVED_DETAILS', response.data);
    } catch (error) {
      console.log('Error Getting User Approved Leaves', error);
      throw error;
    }
  },

  async fetchUserRejectedLeave ({ commit, dispatch }) {
    try {
      const response = await axios.get(`${api}${controllerName}/user-rejected-leaves`, {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`},
      });

      commit('SET_USERREJECTED_DETAILS', response.data);
    } catch (error) {
      console.log('Error Getting User Rejected Leaves', error);
      throw error;
    }
  },


  async approveLeaves({ commit }, leaveId) {
    try {
      await axios.post(`${api}${controllerName}/admin-action`, {
        LeaveID: leaveId,
        Status: 'Approved',
      }, 
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });

    } catch (error) {
      console.error('Failed Approving The Leave', error);
      throw error
    };
  },

  async rejectLeaves({ commit }, rejectData) {
    try {
      await axios.post(`${api}${controllerName}/admin-action`, rejectData,
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });

    } catch (error) {
      console.error('Failed Rejecting The Leave', error);
      throw error;
    };
  },

  async cancelLeave({ commit }, cancelData) {
    try {
      await axios.post(`${api}${controllerName}/cancel-leave`, cancelData,
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`},
      });
    } catch (error) {
      console.error('Failed to cancel leave', error)
      throw error
    }
  },

  async getPendingCancel({ commit }) {
    try {
      const result = await axios.get(`${api}${controllerName}/cancel-leave-pending`, 
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`},
      });
      commit('SET_CANCEL_PENDING', result.data)
    } catch (error) {
      console.log(error, 'Faile to fetch cancel leave pending')
      throw error
    }
  },

  async approveCancelLeaves({ commit }, leaveId) {
    try {
      const result = await axios.post(`${api}${controllerName}/cancel-admin-action`, {
        LeaveID: leaveId,
        Status: 'Approved',
      }, 
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });

    } catch (error) {
      console.error('Failed Approving The Leave', error);
      throw error
    };
  },

  async rejectCancelLeaves({ commit }, rejectData) {

    try {
      await axios.post(`${api}${controllerName}/cancel-admin-action`, rejectData,
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}` },
      });
    } catch (error) {
      console.error('Failed Rejecting The Leave', error);
      throw error;
    };
  },


  async fetchUserCancelApprovedLeaves({ commit }) {
    try {
      const result = await axios.get(`${api}${controllerName}/user-cancel-approve`, 
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`},
      });
      commit('SET_USERAPPROVED_CANCEL', result.data)
    } catch (error) {
      console.log(error, 'Failed to fetch cancel leave pending')
      throw error
    }
  },

  async fetchUserCancelRejectedLeaves({ commit }) {
    try {
      const result = await axios.get(`${api}${controllerName}/user-cancel-rejected`, 
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`},
      });
      commit('SET_USERREJECTED_CANCEL', result.data)
    } catch (error) {
      console.log(error, 'Failed to fetch cancel leave pending')
      throw error
    }
  },

  async fetchRejectedCancelledLeaves({ commit }) {
    try {
      const result = await axios.get(`${api}${controllerName}/rejected-cancel-leaves`, 
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`}, 
      });
      commit('SET_REJECTED_CANCEL', result.data)
    } catch (error) {
      console.log(error, 'Failed to fetch cancel leave pending')
      throw error
    }
  },

  async fetchApprovedCancelledLeaves({ commit }) {
    try {
      const result = await axios.get(`${api}${controllerName}/approved-cancel-leaves`, 
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`},
      });
      commit('SET_APPROVED_CANCEL', result.data)
    } catch (error) {
      console.log(error, 'Failed to fetch cancel leave pending')
      throw error
    }
  },

  async fetchLeaveTypes({ commit }) {
    try {
      const result = await axios.get(`${api}${controllerName}/leave-types`,
      {
        headers: { Authorization: `Bearer ${Cookies.get('token')}`},
      });

      commit('SET_LEAVE_TYPES', result.data)
    } catch (error) {
      console.log(error, 'Failed to fetch leave types')
    }
  },

  clearLeaveDetails({ commit }) {
    commit('CLEAR_LEAVE_DETAILS');
  },


  loadAndConvertToBase64({ commit }, logoPath) {
    
    const image = new Image();
    image.src = logoPath;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = 0.10;
      context.drawImage(image, 0, 0);
      const base64 = canvas.toDataURL('image/png');
      context.globalAlpha = 1.0;

      commit('setBase64Image', base64);
    };
  },

  async fetchEmpDetails({ commit }, dataSelect) {
    try {
      const result = await axios.get(`${api}${controllerName}/employee-details`, {
        params: dataSelect,
        headers: { Authorization: `Bearer ${Cookies.get('token')}` }
      });

      commit('SET_EMP_DETAILS', result.data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  }
  

  

};