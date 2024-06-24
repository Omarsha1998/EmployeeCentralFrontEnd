<template>
  <q-btn-dropdown push style="width: 200px" class="text-black bg-white" split icon="sort" label="FILTER LEAVE">
    <q-list v-if="pendingLeave === true" class="text-bold bg-grey-2">
      <q-item v-if="showHeadDept" class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_HEAD_APPROVE')">
        <q-item-section>
          <q-item-label>Head/Department Pending Leaves</q-item-label>
        </q-item-section>
      </q-item>
      <!-- <q-item v-if="showSupervisor" class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_SUPERVISOR_APPROVE')">
        <q-item-section>
          <q-item-label>Supervisor/Level2 Pending Leaves</q-item-label>
        </q-item-section>
      </q-item> -->
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_FILTERED_LEAVES')">
        <q-item-section>
          <q-item-label>Filter By Department</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_MY_APPROVED')">
        <q-item-section>
          <q-item-label>My Approved Leave</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_MY_REJECTED')">
        <q-item-section>
          <q-item-label>My Rejected Leave</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-list v-if="cancelLeave === true" class="text-bold bg-grey-2">
      <q-item v-if="showHeadDept" class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_HEAD_APPROVE')">
        <q-item-section>
          <q-item-label>Head/Department Pending Canceled Leaves</q-item-label>
        </q-item-section>
      </q-item>
      <!-- <q-item v-if="showSupervisor" class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_SUPERVISOR_APPROVE')">
        <q-item-section>
          <q-item-label>Supervisor/Level2 Pending Leaves</q-item-label>
        </q-item-section>
      </q-item> -->
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_FILTERED_LEAVES')">
        <q-item-section>
          <q-item-label>Filter By Department</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_MY_APPROVED')">
        <q-item-section>
          <q-item-label>My Approved Canceled Leave</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_MY_REJECTED')">
        <q-item-section>
          <q-item-label>My Rejected Rejected Leave</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <q-list v-if="empDetails" class="text-bold bg-grey-2">
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick2('SHOW_LEAVE_DETAILS')">
        <q-item-section>
          <q-item-label>Leave Details</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick2('SHOW_PENDING_LEAVE')">
        <q-item-section>
          <q-item-label>Filed Leaves</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>

</template>


<script>
export default {
  props: {
    showHeadDept: {
      type: Boolean,
      default: false
    },
    // showSupervisor: {
    //   type: Boolean,
    //   default: false
    // },
    pendingLeave: Boolean,
    cancelLeave: Boolean,
    empDetails: Boolean
  },

  methods: {
    
    onItemClick(selectedItem) {
      if (selectedItem === 'SHOW_HEAD_APPROVE') {
        this.$emit('head-approve');
        
      // } else if (selectedItem === 'SHOW_SUPERVISOR_APPROVE') {
      //   this.$emit('supervisor-approve')
      // }
      
      } else if (selectedItem === 'SHOW_FILTERED_LEAVES') {
        this.$emit('filter-leaves');
      } else if (selectedItem === 'SHOW_MY_APPROVED') {
        this.$emit('my-approved')
      } else if (selectedItem === 'SHOW_MY_REJECTED') {
        this.$emit('my-rejected')
      }
    },

    onItemClick2(selectedItem) {
      if (selectedItem === 'SHOW_LEAVE_DETAILS') {
        this.$emit('leave-details');
      } else if (selectedItem === 'SHOW_PENDING_LEAVE') {
        this.$emit('pending-leave'); 
      }
    }
  }
}
</script>

