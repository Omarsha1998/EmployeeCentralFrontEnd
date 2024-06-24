<template>
  <q-btn-dropdown push style="width: 200px" class="text-black bg-white" split icon="sort" label="FILTER LEAVE">
    <q-list v-if="pendingLeave === true || cancelLeave === true" class="text-bold bg-grey-2">
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_APPROVED_LEAVES')">
        <q-item-section>
          <q-item-label>{{ cancelLeave ? 'Approved Canceled Leaves' : 'Approved Leaves' }}</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_REJECTED_LEAVES')">
        <q-item-section>
          <q-item-label>{{ cancelLeave ? 'Rejected Canceled Leaves' : 'Rejected Leaves' }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>

    <!-- <q-list v-if="cancelLeave === true" class="text-bold bg-grey-2">
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_APPROVED_LEAVES')">
        <q-item-section>
          <q-item-label>Approved Canceled Leaves</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="hoverable-item" clickable v-close-popup @click="onItemClick('SHOW_REJECTED_LEAVES')">
        <q-item-section>
          <q-item-label>Rejected Canceled Leaves</q-item-label>
        </q-item-section>
      </q-item>
    </q-list> -->
  </q-btn-dropdown>

  

</template>

<script>
export default {

  props: {
    cancelLeave: Boolean,
    pendingLeave: Boolean,
  },

  methods: {
    onItemClick(selectedItem) {
      if (selectedItem === 'SHOW_APPROVED_LEAVES') {
        this.$emit('show-approved-leaves');
      } else {
        this.$emit('show-rejected-leaves');
      }
    }
  }
}
</script>
