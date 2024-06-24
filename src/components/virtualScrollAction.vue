<template>
  <div v-if="selectedItems.length > 1" class="col-12">
    <div class="q-mb-xs text-center" style="display: flex; justify-content: center; gap: 10px;">
      <q-btn push color="primary" class="q-mr-xs" @click="approveLeave(selectedItems)" label="Approve Selected Leave" />
      <q-btn push color="red" class="q-ml-xs" @click="rejectLeaveDia(selectedItems)" label="Reject Selected Leave" />
    </div>
  </div>

  <!-- <q-table
    :rows="items"
    :columns="columns"
    row-key="name"
    style="max-height: 450px"
    flat bordered
    hide-pagination
    :selected-rows-label="getSelectedString"
    selection="multiple"
    v-model:selected="selected"
    virtual-scroll
    :rows-per-page-options="[0]"
  >
    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td style="width: 10px;" class="text-center">
          <q-checkbox v-model="selected" :val="props.row" />
        </q-td>
        <q-td v-for="col in props.cols" :key="col.name" :props="props" class="text-center" :style="{ width: col.width || 'auto' }">
          {{ col.field === 'leaveType' ? LeaveTypeLabels[props.row[col.field]] : col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo' ? formatDateTime(props.row[col.field]) : props.row[col.field] }}
          <template v-if="col.name === 'Actions'">
            <q-btn
              style="width: 50%;"
              push
              @click="approveLeave(props.row.leaveId)"
              icon="check_circle"
              color="green"
              class="q-mr-xs"
              :disable="selected.length > 1"
            />
            <q-btn
              push
              @click="rejectLeaveDia(props.row.leaveId)"
              icon="cancel"
              color="negative"
              style="width: 50%;"
              :disable="selected.length > 1"
            />
          </template>
        </q-td>
      </q-tr>
    </template>
  </q-table> -->

  <q-virtual-scroll
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
          <th style="width: 10px;">
            <q-checkbox v-model="selectAllLevel1" @click="selectAllItems"></q-checkbox>
          </th>
          <th v-for="col in columns" :key="col.name">
            {{ col.name }}
          </th>
        </tr>
      </thead>
    </template>
    <template v-slot="{ item: row, name }">
      <q-tr :key="name">
        <q-td style="width: 10px;" class="text-center">
          <q-checkbox v-model="selectedItems" :val="row" @click="selectedRows" />
        </q-td>
        <q-td v-for="col in columns" :key="col.name" class="text-center" :style="{ width: col.width || 'auto' }">
          <!-- {{ col.field === 'leaveType' ? LeaveTypeLabels[row[col.field]] : col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo' ? formatDateTime(row[col.field]) : row[col.field] }} -->
          <!-- {{ getFormattedCellValue(row, col) }} -->
          <renderCell :row="row" :col="col" :LeaveTypeLabels="LeaveTypeLabels"/>
          <template v-if="col.name === 'Reason'">
          <q-btn
            push
            @click="reasonLeave(row.reasonForLeave)"
            icon="article"
            color="primary"
            style="width: 50%;"
            :disable="selectedItems.length > 1"
          />
          </template>
          <template v-if="col.name === 'Actions'">
            <q-btn
              style="width: 50%;"
              push
              @click="approveLeave(row.leaveId)"
              icon="check_circle"
              color="green"
              class="q-mr-xs"
              :disable="selectedItems.length > 1"
            />
            <q-btn
              push
              @click="rejectLeaveDia(row.leaveId)"
              icon="cancel"
              color="negative"
              style="width: 50%;"
              :disable="selectedItems.length > 1"
            />
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


  <q-dialog v-model="rejectDialog">
    <q-card
      :class="['bold-text', $q.screen.name + '-text', $q.screen.name + '-width', $q.screen.name + '-min-height']"
      class="rounded"
    >
      <q-card-section class="bg-primary row items-center q-pb-sm">
        <div class="text-h6 text-white text-bold">Reason For Rejecting Leave(s)</div>
        <q-space></q-space>
        <q-btn class="bg-white" icon="close" push round dense padding="xs" v-close-popup></q-btn>
      </q-card-section>
      <q-card-section class="q-pt-xm">
        <q-input class="bg-grey-3" filled v-model="reasonForRejection" placeholder="Type here" type="textarea"></q-input>
      </q-card-section>
      <q-card-actions style="display: flex; justify-content: right" class="q-pr-md">
        <div style="display: flex; justify-content: center; gap: 10px;">
          <q-btn class="bg-negative text-white text-subtitle1" push label="cancel" @click="cancelReject" />
          <q-btn class="bg-primary text-white text-subtitle1" push label="confirm" @click="rejectLeave" />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { QSpinnerIos } from 'quasar';
import helperMethods from '../helperMethods.js'
import renderCell from '../components/helpers/renderCell.vue'

export default {
  props: {
    items: Array,
    columns: Array,
    LeaveTypeLabels: Object,
    selectedDeptDescription: String, 
    sortedPendingLeave: Array,
    fetchapprovedLeaves: Function,
    fetchrejectedLeaves: Function,
    fetchpendingLeaves: Function,
    fetchUserApprovedLeaves: Function,
    fetchUserRejectedLeaves: Function,
  
  },

  data () {
    return {
      selectAllLevel1: false,
      selectAllLevel2: false,
      rejectId: '',
      rejectDialog: false,
      reasonForRejection: '',
      selectedItems: [],
      deptValidation: false,
      selected: [],
      reasonForLeave: '',
      reasonDialog: false
    }
  },

  components: {
    renderCell
  },

  methods: {
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

    getSelectedString() {
      return this.selected.length === 0 ? '' : `${this.selected.length} record${this.selected.length > 1 ? 's' : ''} selected of ${this.items.length}`;
    },

    // formatDateTime(dateTimeString) {
    //   const options = {
    //     year: 'numeric',
    //     month: 'numeric',
    //     day: 'numeric'
    //   };
    //   const dateTime = new Date(dateTimeString);
    //   return dateTime.toLocaleDateString(undefined, options);
    // },

    selectAllItems() {
      if (this.selectAllLevel1) {
        if (this.selectedDeptDescription.length > 0 && this.deptValidation === false) {
          this.selectedItems = this.sortedPendingLeave.filter(row => row.deptDescription === this.selectedDeptDescription);
          this.deptValidation = true
        } else {
          this.selectedItems = [...this.sortedPendingLeave];
        }
      } else {
        this.selectedItems = [];
      }
      this.deptValidation = false
    },

    reasonLeave(reasonForLeave){
      this.reasonDialog = true
      this.reasonForLeave = reasonForLeave
    },

    selectedRows() {
      this.selectAllLevel1 = false
      this.selectAllLevel2 = false
    },

    rejectLeaveDia(leaveId) {
      this.rejectDialog = true;
      this.rejectId = leaveId;
    },

    cancelReject() {
      this.reasonForRejection = '';
      this.rejectDialog = false;
    },

    // confirm(leaveId) {
    //   $q.dialog({
    //     title: 'Confirm',
    //     message: 'Would you like to turn on the wifi?',
    //     cancel: true,
    //     persistent: true
    //   }).onOk(() => {
    //     // console.log('>>>> OK')
    //   }).onOk(() => {
    //     // console.log('>>>> second OK catcher')
    //   }).onCancel(() => {
    //     // console.log('>>>> Cancel')
    //   }).onDismiss(() => {
    //     // console.log('I am triggered on both OK and Cancel')
    //   })
    // },

    async approveLeave(leaveId) {
      let isMultiple = false;
      
      this.$q.dialog({
        title: 'Confirmation',
        message: `Are you sure you want to approve ${isMultiple ? 'these leaves?' : 'this leave?'}`,
        cancel: true,
        persistent: true,
        ok: {
          push: true,
          color: 'primary',
          label: 'Confirm',
          class: 'text-subtitle1'
        },
        cancel: {
          push: true,
          color: 'negative',
          label: 'Cancel',
          class: 'text-subtitle1'
        },
        titleClass: 'custom-title-class'
      }).onOk(async () => {
        try {
          let leaveIds;
          if (Array.isArray(leaveId)) {
            leaveIds = leaveId.map(item => item.leaveId);
            isMultiple = leaveIds.length > 1;
          } else {
            leaveIds = [leaveId];
          }

          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: 'Approving Leave Request',
            messageColor: 'primary',
            backgroundColor: 'grey-1',
            spinnerColor: 'primary',
            customClass: 'custom-loading-style',
            spinnerSize: '7em',
          });

          await helperMethods.delay(1500);
          await this.$store.dispatch('leaveModule/approveLeaves', leaveIds);
          this.selectedItems = []
          await this.fetchapprovedLeaves();
          await this.fetchpendingLeaves();
          await this.fetchUserApprovedLeaves();
          this.$q.loading.hide();
          this.$q.notify({
            color: 'positive',
            position: 'center',
            message: `Success Approving Leave Request${isMultiple ? 's' : ''}`,
            icon: 'check',
            iconColor: 'white',
            timeout: 1000,
            progress: true,
          });
          helperMethods.disablePointerEvents(2000);
          this.selectAllLevel1 = false;
          this.selectAllLevel2 = false;
        } catch (error) {
          if(error.response.status === 405) {
            this.$q.loading.hide();
            console.error('Error Approving Leave Request');
            this.$q.notify({
              color: 'negative',        
              position: 'center',
              message: 'You Are Not Allowed/Authorized To Approve This Leave',
              icon: 'report_problem',  
              iconColor: 'white',
              timeout: 1000,
              progress: true,
            });
            return;
          }
          this.$q.loading.hide();
          console.error('Error Approving Leave Request');
          this.$q.notify({
            color: 'negative',        
            position: 'center',
            message: 'Failed Approving Leave',
            icon: 'report_problem',  
            iconColor: 'white',
            timeout: 1000,
            progress: true,
          });
        }

      }).onDismiss(() => {
      });
    },

    async rejectLeave() {
      let isMultiple = false;

      if(!this.reasonForRejection) {
        this.$q.notify({
          color: 'negative',
          position: 'center',
          message: 'Input the Required Field',
          icon: 'report_problem',
          iconColor: 'white',
          timeout: 1000,
          progress: true,
        });
        return;
      }

      this.$q.dialog({
        title: 'Confirmation',
        message: `Are you sure you want to reject ${isMultiple ? 'these leaves?' : 'this leave?'}`,
        cancel: true,
        persistent: true,
        ok: {
          push: true,
          color: 'primary',
          label: 'Confirm',
          class: 'text-subtitle1'
        },
        cancel: {
          push: true,
          color: 'negative',
          label: 'Cancel',
          class: 'text-subtitle1'
        }
      }).onOk(async () => {

        try {
          let leaveIds;
          const reason = this.reasonForRejection;

          if(reason.length === 0) {
            this.$q.notify({
              color: 'negative',
              position: 'center',
              message: 'Input the Required Field (Reason)',
              icon: 'report_problem',
              iconColor: 'white',
              timeout: 1000,
              progress: true,
            });
            return;
          }

          if (Array.isArray(this.rejectId)) {
            leaveIds = this.rejectId.map(item => item.leaveId);
            isMultiple = leaveIds.length > 1;
          } else {
            leaveIds = [this.rejectId];
          }
          const rejectData = {
            LeaveID: leaveIds,
            reason: reason,
            Status: 'Rejected'
          };

          this.$q.loading.show({
            spinner: QSpinnerIos,
            message: 'Rejecting Leave Request',
            messageColor: 'primary',
            backgroundColor: 'grey-1',
            spinnerColor: 'primary',
            customClass: 'custom-loading-style',
            spinnerSize: '7em',
          });

          this.rejectDialog = false;
          await helperMethods.delay(1500);
          await this.$store.dispatch('leaveModule/rejectLeaves', rejectData);
          this.selectedItems = []
          await this.fetchUserRejectedLeaves();
          await this.fetchpendingLeaves();
          await this.fetchrejectedLeaves();
          this.$q.loading.hide();
          this.reasonForRejection = '';
          this.$q.notify({
            color: 'positive',
            position: 'center',
            message: `Success Rejecting Leave Request${isMultiple ? 's' : ''}`,
            icon: 'check',
            iconColor: 'white',
            timeout: 1000,
            progress: true,
          });
          helperMethods.disablePointerEvents(2000);
          this.selectAllLevel1 = false;
          this.selectAllLevel2 = false;
        } catch (error) {
          if(error.response.status === 405) {
            this.$q.loading.hide();
            this.reasonForRejection = '';
            console.error('Error Approving Leave Request');
            this.$q.notify({
              color: 'negative',        
              position: 'center',
              message: 'You Are Not Allowed/Authorized To Reject This Leave',
              icon: 'report_problem',  
              iconColor: 'white',
              timeout: 1000,
              progress: true,
            });
            return;
          }
          this.$q.loading.hide();
          this.reasonForRejection = '';
          console.error('Error Rejecting Leave Request');
          this.$q.notify({
            color: 'negative',
            position: 'center',
            message: 'Failed Rejecting Leave Request',
            icon: 'report_problem',
            iconColor: 'white',
            timeout: 1000,
            progress: true,
          });
        }
      }).onDismiss(() => {
      })
    },

    // getFormattedCellValue(row, col) {
    //   if (col.field === 'leaveType') {
    //     return this.LeaveTypeLabels[row[col.field]];
    //   } else if (col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo' || col.field === 'transDate') {
    //     return this.formatDateTime(row[col.field]);
    //   } else {
    //     return row[col.field];
    //   }
    // },

    isTimeEnabled() {
      return (this.Days % 1 !== 0) || (this.Days2 % 1 !== 0);
    },
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

