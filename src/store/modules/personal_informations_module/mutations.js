export default {
  SET_NEW_VALUES(state, data) {
    state.personal_informations = data;
  },
  SET_DEFAULT_VALUES(state) {
    state.personal_informations = null;
  }
};
