export default {
  SET_ANNOUNCEMENTS(state, announcements) {

    if (announcements) {
      for (const ann of announcements) {
        if (ann.links) {
          ann.links = ann.links.replace("http://10.107.5.253", "https://apps.uerm.edu.ph");
        }

        if (ann.description) {
          ann.description = ann.description.replace(/src="http:\/\/10\.107\.5\.253/g, 'src="https://apps.uerm.edu.ph');
        }
      }
    }    
    state.announcements = announcements;
  },

};