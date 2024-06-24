<template>
  <q-btn-dropdown
    push
    style="width: 200px"
    class="text-black bg-white"
    icon="sort"
    label="FILTER LEAVE"
    dropdown-icon="change_history"
  >
    <q-list class="text-bold bg-grey-2">
      <q-item
        v-for="item in menuItems"
        :key="item.label"
        class="hoverable-item"
        clickable
        v-close-popup
        @click="onItemClick(item.action)"
      >
        <q-item-section>
          <q-item-label>{{ item.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </q-btn-dropdown>
</template>

<script>
export default {
  props: {
  },

  data() {
    return {
      menuItems: [
        { label: 'Leave History', action: 'SHOW_LEAVE_HISTORY' },
        { label: 'Forfeited Leaves', action: 'SHOW_FORFEITED_LEAVES' },
        { label: 'Leave Approvers', action: 'SHOW_LEAVE_APPROVERS' },
      ],

    };
  },
  methods: {
    onItemClick(selectedItem) {
      if (selectedItem === 'SHOW_LEAVE_HISTORY') {
        this.$emit('show-leave-history');
      } else if (selectedItem === 'SHOW_FORFEITED_LEAVES') {
        this.$emit('show-forfeited-leaves');
      } else if (selectedItem === 'SHOW_LEAVE_APPROVERS') {
        this.$emit('show-leave-approvers');
      }
    }
  }
};
</script>
