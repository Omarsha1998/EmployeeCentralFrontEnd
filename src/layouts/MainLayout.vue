<template>
  <q-layout view="lHh Lpr lFf" v-if="hasAllValues === true">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="ontoggleLeftDrawer()"
        />
        <q-toolbar-title @click="redirect()" style="cursor: pointer">
          {{ app_name }}
        </q-toolbar-title>

        <div>v {{ app_version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <div class="example-row-equal-width">
          <div class="row">
            <!-- <div class="col bg-grey-2">
              <q-avatar size="90px" class="center">
                <img src="../assets/images/uerm-logo.png" alt="uerm-logo" />
              </q-avatar>
            </div> -->
            <div class="col bg-none">
              <!-- <q-avatar style="border-radius: 0; width: 170px; height: 120px;" class="center">
                <img
                  src="../assets/images/uerm-hospital-logo.png"
                  alt="uerm-hospital-logo"
                />
              </q-avatar> -->
              <div style="display: flex; justify-content: center">
                <img
                  src="../assets/images/uerm-hospital-logo.png"
                  alt="avatar"
                  style="width: 70%; height: 125px"
                />
              </div>
            </div>
          </div>
        </div>

        <q-card-section style="margin: 60px 0">
          <q-avatar size="160px" class="absolute-center">
            <img :src="image_rest_api + employeeID" alt="avatar" />
          </q-avatar>
        </q-card-section>

        <q-item-label header class="text-center">
          <span> {{ employeeID }}</span>
          <br />
          <span style="font-weight: bold"> {{ employeeFullName }} </span>
        </q-item-label>

        <q-item to="/announcements">
          <q-item-section avatar>
            <q-icon name="message" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Announcements</q-item-label>
          </q-item-section>
        </q-item>

        <q-expansion-item
          class="custom-expansion-item"
          icon="info"
          label="Personnel Information System"
          v-if="hasPISAccess"
        >
          <q-card>
            <q-card-section>
              <EssentialLink
                v-for="link in essentialLinks"
                :key="link.title"
                v-bind="link"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          class="custom-expansion-item"
          icon="event_busy"
          label="Leave Management System"
        >
          <q-card>
            <q-card-section>
              <EssentialLink
                v-for="link in filteredChildren"
                :key="link.title"
                v-bind="link"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-expansion-item
          class="custom-expansion-item"
          icon="schedule"
          label="DTR Management"
        >
          <q-card>
            <q-card-section>
              <EssentialLink
                v-for="link in DTRLinks"
                :key="link.title"
                v-bind="link"
              />
            </q-card-section>
          </q-card>
        </q-expansion-item>

        <q-item clickable @click="onLogout()">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Logout</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import helperMethods from "../helperMethods.js";

export default defineComponent({
  name: "MainLayout",
  components: {
    EssentialLink,
  },
  computed: {
    hasAllValues() {
      return this.$store.getters["user_module/has_all_values"];
    },
    employeeID() {
      return this.$store.getters["user_module/employee_id"];
    },
    employeeFullName() {
      return this.$store.getters["user_module/employee_full_name"];
    },
    isHR() {
      return this.$store.getters["user_module/is_hr"];
    },
    isPISApprover() {
      return this.$store.getters["user_module/is_pis_approver"];
    },
    isLicense() {
      return this.$store.getters["user_module/is_license"];
    },
    hasWorkExperience() {
      return this.$store.getters["user_module/has_work_experience"];
    },
    hasPISAccess(){
      return this.$store.getters["user_module/has_pis_access"];
    },
    mainLinks() {
      return this.$store.getters["helpers/mainLinks"];
    },
    DTRLinks() {
      const dtrLinks = this.$store.getters["helpers/DTRLinks"];
      return dtrLinks.length > 0 ? dtrLinks[0].children : [];
    },
    // filteredChildren() {
    //   if (this.isLeaveApprover) {
    //     return this.mainLinks[0].children;
    //   } else {
    //     return this.mainLinks[0].children.filter(child => child.title !== 'Leave Authorization' && child.title !== 'Canceled Leave Authorization');
    //   }
    // },
    
    filteredChildren() {
      if (this.isLeaveApprover) {
        return this.mainLinks[0].children;
      } else {
        return this.mainLinks[0].children.filter(
          (child) =>
            child.title !== "Leave Authorization" &&
            child.title !== "Canceled Leave Authorization" &&
            !(
              child.title === "Employee Leave Details" &&
              this.isPISApprover === false
            )
        );
      }
    },

    isLeaveApprover() {
      return this.$store.getters["user_module/is_leave_approver"];
    },
  },
  data: function () {
    return {
      app_name: process.env.APP_NAME,
      app_version: process.env.APP_VERSION,
      image_rest_api: process.env.IMAGE_REST_API_URL,
      essentialLinks: this.getLinkLists(),
      leftDrawerOpen: false,
    };
  },
  created: function () {
    // User is not PIS Approver
    if (this.isPISApprover === false) {
      this.removeTab("Other Request");
      this.removeTab("Attachment Archive");
      this.removeTab("Export Personal Information");
      this.removeTab("Maintenance");
    }

    // User is not license
    if (this.isLicense === false) {
      this.removeTab("License");
    }

    // Check if there is no previous work experiences
    if (this.hasWorkExperience === false) {
      this.removeTab("Work Experience");
    }

  },
  methods: {
    redirectToAnnouncements: function () {
      // Redirect to the announcements page
      this.$router.push("/announcements");
    },
    redirect: function () {
      helperMethods.redirect("/");
    },
    ontoggleLeftDrawer: function () {
      this.leftDrawerOpen = !this.leftDrawerOpen;
    },
    onLogout: async function () {
      await this.$store.dispatch("user_module/logout", this.employeeID);
      localStorage.clear();
      helperMethods.refreshPage();
      localStorage.clear();
    },
    getLinkLists: function () {
      let linksList = [
        {
          title: "Other Request",
          icon: "mail",
          link: "/other-request",
        },
        {
          title: "My Request",
          icon: "notes",
          link: "/my-request",
        },

        {
          title: "Personal Information",
          icon: "person",
          link: "/personal-information",
        },
        {
          title: "Family Background",
          icon: "people",
          link: "/family-background",
        },
        {
          title: "Educational Background",
          icon: "school",
          link: "/educational-background",
        },
        {
          title: "Work Experience",
          icon: "work",
          link: "/work-experience",
        },
        {
          title: "License",
          icon: "newspaper",
          link: "/license",
        },
        {
          title: "Training/Seminar",
          icon: "event",
          link: "/training-or-seminar",
        },
        {
          title: "Attachment Archive",
          icon: "upload",
          link: "/attachment-archive",
        },
        {
          title: "Export Personal Information",
          icon: "download",
          link: "/export-personal-information",
        },
        {
          title: "Maintenance",
          icon: "settings",
          link: "/maintenance",
        },
      ];
      return linksList;
    },

    // DTRLinks: function () {
    //   let DTRList = [
    //     {
    //       title: "Daily Time Record",
    //       icon: "mail",
    //       link: "/other-request",
    //     },
    //     {
    //       title: "Time Adjustment",
    //       icon: "upload",
    //       link: "/attachment-archive",
    //     },
    //   ];
    //   return DTRList;
    // },
    removeTab: function (title) {
      const itemToBeRemoved = { title: title };
      let index = this.essentialLinks.findIndex(
        (x) => x.title === itemToBeRemoved.title
      );
      this.essentialLinks.splice(index, 1);
    },
  },
});
</script>
