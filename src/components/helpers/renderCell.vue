<template>
  <span>{{ renderCell(row, col) }}</span>
</template>

<script>
export default {

  props: {
    row: Object,
    col: Object,
    LeaveTypeLabels: Object, 
    userCode: String,
    cancelView: Boolean, 
  },

  methods: {

    renderCell(row, col) {
      if (col.field === 'leaveType' && this.LeaveTypeLabels) {
        return this.LeaveTypeLabels[row[col.field]];
      } else if (col.field === 'dateLeavedFrom' || col.field === 'dateLeavedTo' || col.field === 'transDate') {
        return this.formatDateTime(row[col.field]);
      } else if (col.field === 'tIME_FROM' || col.field === 'tIME_TO') {
        return this.formatTimeTo12Hours(row[col.field]);
      } else if (col.name === 'Date Approved' && this.cancelView === false) {
        if (row.approvedByLevel1 !== null && row.approvedByLevel1 == this.userCode) {
          return this.formatDateTime(row.approvedByLevel1DateTime);
        } else if (row.approvedByLevel2 !== null && row.approvedByLevel2 == this.userCode) {
          return this.formatDateTime(row.approvedByLevel2DateTime);
        } else {
          return this.formatDateTime(row.approvedByLevel2DateTime);
        }
      } else if (col.name === 'Date Approved' && this.cancelView === true) {
        return this.formatDateTime(row.cancelledByLevel2DateTime);
      } else if (col.name === 'Date Rejected') {
        if (row.rejectedByLevel1 !== null && row.rejectedByLevel1 == this.userCode) {
          return this.formatDateTime(row.rejectedByLevel1DateTime);
        } else if (row.rejectedByLevel2 !== null && row.rejectedByLevel2 == this.userCode) {
          return this.formatDateTime(row.rejectedByLevel2DateTime);
        } else if (row.rejectedByLevel1 === null) {
          return this.formatDateTime(row.rejectedByLevel1DateTime)
        } else {
          return this.formatDateTime(row.rejectedByLevel1DateTime)
        }
      } else {
        return row[col.field];
      }
    },
    
    formatDateTime(dateTimeString) {
      const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      };
      const dateTime = new Date(dateTimeString);
      return dateTime.toLocaleDateString(undefined, options);
    },

    formatTimeTo12Hours(Time) {
      return Time.toLocaleTimeString('en-US', {hour: 'numeric', minute: 'numeric', hour12: true,});
    },



  }
};
</script>
