<template>
  <router-view />
</template>

<script>
// -------------------- Notify plugins --------------------
import { useQuasar } from "quasar";
let $q;
// -------------------- Notify plugins --------------------

import helperMethods from './helperMethods';

export default {
  name: "App",
  mounted: function () {
    this.$q.dark.set(false);
    $q = useQuasar();

    let message = helperMethods.getCookie("notify_message");
    let type = helperMethods.getCookie("notify_type");

    if(!message && !type) {
      return
    }

    $q.notify({
      type: type,
      message: message,
    });



    helperMethods.deleteCookie("notify_message");
    helperMethods.deleteCookie("notify_type");
  },
};
</script>
