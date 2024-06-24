<template>
  <q-layout>
    <q-page-container>
      <div class="container">
        <div class="row" style="width: 90%;">
          <div class="col-12 q-pt-lg q-pb-lg">
            <template v-for="announcement in sortedAnnouncements" :key="announcement.id">
              <q-card class="q-mb-lg">
                <q-card-section>
                  <!-- <div style="font-size: 15px;">{{ getMonthAndYear(announcement.id) }}</div> -->
                  <div style="font-size: 18px;">{{ getFormattedDate(announcement.dateTimeCreated) }}</div>
                  <div style="font-size: 20px;" class="text-bold">{{ announcement.name }}</div>
                </q-card-section>
                <q-card-section v-if="announcement.description">
                  <div class="text-justify text-bold" v-html="announcement.description"></div>
                </q-card-section>
                <q-card-section class="text-center">
                  <div v-if="announcement.fileType === 'img' || announcement.fileType === 'jpg'" >
                    <img :src="announcement.links" alt="Announcement Image" style="max-height: 500px; width: auto;"/>
                  </div>
                  <div v-else-if="announcement.fileType === 'pdf'" class="divimgqtn" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div class="blurred-image">
                    </div>
                    <q-btn color="white" text-color="primary" @click="openPdfLink(announcement.links)" label="CLICK FOR MORE INFO" class="center-btn"/>
                  </div>
                </q-card-section>
              </q-card>
            </template>
          </div>
        </div>
      </div>
    </q-page-container>
  </q-layout>
</template>



<script>

export default {
  name: "Announcements",
  data() {
    return {
      announcement: [],
      carouselIndex: 1,
    };
  },

  computed: {
    sortedAnnouncements() {
      return this.announcement.slice().sort((a, b) => {
        const dateA = new Date(a.dateTimeCreated);
        const dateB = new Date(b.dateTimeCreated);
        return dateB - dateA; 
      });
    },
  },
  methods: {
    async getAnnouncements() {
      try {
        await this.$store.dispatch("announcementModule/fetchAnnouncements");
        this.announcement = this.$store.state.announcementModule.announcements;
      } catch (error) {
        console.error("Failed getting Leave Details", error);
      }
    },

    getFormattedDate(dateTimeCreated) {
      // Convert dateTimeCreated to a JavaScript Date object
      const date = new Date(dateTimeCreated);
      
      // Define an array to map month names
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
        
      return month + " " + year;
    },

    getMonthAndYear(announcementID) {
      const announcement = this.sortedAnnouncements.find(a => a.ID === announcementID);
      if (announcement && announcement.dateTimeCreated) {
        const dateTime = new Date(announcement.dateTimeCreated);
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const year = dateTime.getFullYear();
        const month = monthNames[dateTime.getMonth()];
        return `${month} ${year}`;
      }
      return '';
    },
    
    openPdfLink(link) {
      window.open(link, '_blank');
    },
    
  },
  created() {
    this.getAnnouncements();
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.blurred-image {
  width: 80%;
  height: 400px;
  position: relative;
  margin: auto;
  background: url(../assets/images/PDFBackground.png) center/cover no-repeat;
  filter: blur(2px);
  opacity: 1.5; 
}

.center-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}


</style>