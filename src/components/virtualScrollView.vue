<template>
  <!-- <q-table
    v-if="leaveView === true"
    :rows="items"
    :columns="columns"
    row-key="name"
    style="max-height: 450px"
    flat bordered
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-pagination
  >
    <template v-slot:before>
      <thead class="sticky-thead">
        <tr>
          <th v-for="col in columns" :key="col.name">
            {{ col.name }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot:body="{ row, name }">
      <q-tr :key="name">
        <q-td v-for="col in columns" :key="col.name" class="text-center" :style="{ width: col.width || 'auto' }">
          <template v-if="col.name === 'Actions/Status' || col.name === 'Actions'">
            <q-card
              v-if="row.approvedByLevel1 !== null || row.approvedByLevel2 !== null"
              class="action-card approved-card"
            >
              <q-card-section push class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                Approved
              </q-card-section>
            </q-card>

            <q-card
              v-else-if="row.status === 'RejectedByLevel1' || row.status === 'RejectedByLevel2'"
              class="action-card rejected-card"
            >
              <q-card-section push class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                Rejected
              </q-card-section>
            </q-card>
          </template>
          <template v-else>
            {{ renderCell(row, col) }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-table> -->

  <q-virtual-scroll
    v-if="leaveView === true"
    class="virtual-scroll"
    type="table"
    style="max-height: 450px"
    :virtual-scroll-item-size="48"
    :virtual-scroll-sticky-size-start="48"
    :virtual-scroll-sticky-size-end="32"
    :items="items"
  >
    <template v-slot:before>
      <thead class="sticky-thead">
        <tr>
          <th v-for="col in columns" :key="col.name">
            {{ col.name }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot="{ item: row, name }">
      <q-tr :key="name">
        <q-td v-for="col in columns" :key="col.name" class="text-center" :style="{ width: col.width || 'auto' }">
          <template v-if="col.name === 'Actions/Status' || col.name === 'Actions'">
            <q-card
              v-if="row.status === 'RejectedByLevel1' || row.status === 'RejectedByLevel2'"
              class="action-card rejected-card"
            >
              <q-card-section push class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                Rejected
              </q-card-section>
            </q-card>

            <q-card
              v-else-if="row.approvedByLevel1 !== null || row.approvedByLevel2 !== null "
              class="action-card approved-card"
            >
              <q-card-section push class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                Approved
              </q-card-section>
            </q-card>

          </template>
          <template v-else-if="col.name === 'Reason'">
            <q-btn
              push
              @click="reasonLeave(row.reasonForLeave)"
              icon="article"
              color="primary"
              style="width: 50%;"
            />
          </template>
          <template v-else>
            <!-- {{ renderCell(row, col) }} -->
            <renderCell :row="row" :col="col" :LeaveTypeLabels="LeaveTypeLabels" :userCode="userCode"/>
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-virtual-scroll>

  <!-- <q-table
    v-if="cancelView === true"
    :rows="items"
    :columns="columns"
    row-key="name"
    style="max-height: 450px"
    flat bordered
    virtual-scroll
    :rows-per-page-options="[0]"
    hide-pagination
  >
    <template v-slot:before>
      <thead class="sticky-thead">
        <tr>
          <th v-for="col in columns" :key="col.name">
            {{ col.name }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot:body="{ row, name }">
      <q-tr :key="name">
        <q-td v-for="col in columns" :key="col.name" class="text-center" :style="{ width: col.width || 'auto' }">
          <template v-if="col.name === 'Actions/Status' || col.name === 'Actions'">
            <q-card
              v-if="row.cancelledByLevel1 !== null || row.cancelledByLevel2 !== null"
              class="action-card approved-card"
            >
              <q-card-section push class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                Approved
              </q-card-section>
            </q-card>

            <q-card
              v-else-if="row.cancelledStatusOrig === 'cancelRejectedByLevel1' || row.cancelledStatusOrig === 'cancelRejectedByLevel2'"
              class="action-card rejected-card"
            >
              <q-card-section push class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                Rejected
              </q-card-section>
            </q-card>
          </template>
          <template v-else>
            {{ renderCell(row, col) }}
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-table> -->


  <q-virtual-scroll
    v-if="cancelView === true"
    class="virtual-scroll"
    type="table"
    style="max-height: 450px"
    :virtual-scroll-item-size="48"
    :virtual-scroll-sticky-size-start="48"
    :virtual-scroll-sticky-size-end="32"
    :items="items"
  >
    <template v-slot:before>
      <thead class="sticky-thead">
        <tr>
          <th v-for="col in columns" :key="col.name">
            {{ col.name }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot="{ item: row, name }">
      <q-tr :key="name">
        <q-td v-for="col in columns" :key="col.name" class="text-center" :style="{ width: col.width || 'auto' }">
          <template v-if="col.name === 'Actions/Status' || col.name === 'Actions'">
            <q-card
              v-if="row.cancelledByLevel1 !== null || row.cancelledByLevel2 !== null"
              class="action-card approved-card"
            >
              <q-card-section push class="bg-positive text-white text-h6 text-center" style="line-height: 25%;">
                Approved
              </q-card-section>
            </q-card>

            <q-card
              v-else-if="row.cancelledStatusOrig === 'RejectedByLevel1' || row.cancelledStatusOrig === 'RejectedByLevel2'"
              class="action-card rejected-card"
            >
              <q-card-section push class="bg-negative text-white text-h6 text-center" style="line-height: 25%;">
                Rejected
              </q-card-section>
            </q-card>
          </template>
          <template v-else>
            <!-- {{ renderCell(row, col) }} -->
            <renderCell :row="row" :col="col" :LeaveTypeLabels="LeaveTypeLabels" :userCode="userCode"/>
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-virtual-scroll>


  <q-dialog v-model="reasonDialog">
    <q-card 
      :class="['bold-text', $q.screen.name + '-text', $q.screen.name + '-width', $q.screen.name + '-min-height']"
      class="rounded"
    >
      <q-card-section class="bg-primary row items-center q-pb-sm">
        <div class="text-h6 text-white text-bold">Leave Request Reason</div>
        <q-space></q-space>
        <q-btn class="bg-white" icon="close" push round dense padding="xs" v-close-popup></q-btn>
      </q-card-section>
      <q-card-section class="q-pt-xm text-justify text-subtitle1">
        {{ reasonForLeave }}
      </q-card-section>
    </q-card>
  </q-dialog>

</template>


<script>
import { mapGetters } from 'vuex'
import renderCell from '../components/helpers/renderCell.vue'

export default {
  props: {
    items: Array,
    columns: Array,
    LeaveTypeLabels: Object,
    leaveView: Boolean,
    cancelView: Boolean,
  },

  data () {
    return {
      reasonForLeave: '',
      reasonDialog: false
    }
  },

  components: {
    renderCell
  },
    
  computed: {
    ...mapGetters({
      userCode: "user_module/employee_id"
    }),
  },

  methods: {

    reasonLeave(reasonForLeave){
      this.reasonDialog = true
      this.reasonForLeave = reasonForLeave
    },

    // renderCell(row, col) {
    //   if (col.field === 'leaveType' && this.LeaveTypeLabels) {
    //     return this.LeaveTypeLabels[row[col.field]];
    //   } else if (col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo' || col.field === 'transDate') {
    //     return this.formatDateTime(row[col.field]);
    //   } else if (col.name === 'Date Approved') {
    //     if (row.approvedByLevel1 !== null && row.approvedByLevel1 == this.userCode) {
    //       return this.formatDateTime(row.approvedByLevel1DateTime);
    //     } else if (row.approvedByLevel2 !== null && row.approvedByLevel2 == this.userCode) {
    //       return this.formatDateTime(row.approvedByLevel2DateTime);
    //     } else {
    //       return row[col.field];
    //     }
    //   } else if (col.name === 'Date Rejected') {
    //     if (row.rejectedByLevel1 !== null && row.rejectedByLevel1 == this.userCode) {
    //       return this.formatDateTime(row.rejectedByLevel1DateTime);
    //     } else if (row.rejectedByLevel2 !== null && row.rejectedByLevel2 == this.userCode) {
    //       return this.formatDateTime(row.rejectedByLevel2DateTime);
    //     } else {
    //       return row[col.field];
    //     }
        
    //   } else {
    //     return row[col.field];
    //   }
    // },

    // formatDateTime(dateTimeString) {
    //   const options = {
    //     year: 'numeric',
    //     month: 'numeric',
    //     day: 'numeric'
    //   };
    //   const dateTime = new Date(dateTimeString);
    //   return dateTime.toLocaleDateString(undefined, options);
    // },
  }
}
</script>

<style>

.roundedd {
  border-radius: 10px;
  margin-bottom: 50px;
  margin-top: 10px;
  height: 560px;
}


.roundedd1 {
  border-radius: 10px;
  padding-bottom: 10px;

}



.containermainn {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}


.q-date-container {
  position: relative;
}

.no-dropdown .q-btn-dropdown__arrow {
  display: none;
}


</style>
