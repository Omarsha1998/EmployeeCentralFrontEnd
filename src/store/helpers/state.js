export default {
  mainLinks: [
    {
      title: 'Leave Management',
      caption: 'Leave Application',
      children: [
        {
          title: 'My Leaves',
          caption: 'Leave Request',
          link: '/Leave',
          icon: 'manage_accounts',
        },
        {
          title: 'Leave Authorization',
          caption: 'Admin Rights',
          link: '/LeaveOperation',
          icon: 'credit_score',
        },
        {
          title: 'Canceled Leave Authorization',
          caption: 'Canceled Leave',
          link: '/CanceledLeave',
          icon: 'event_busy'
        },
        {
          title: 'Employee Leave Details',
          caption: 'Employee Details',
          link: '/EmployeeDetails',
          icon: 'badge'
        }
      ],
    },
  ],
  DTRLinks: [
    {
      title: 'DTR Time Record',
      caption: 'Daily Time Record Application',
      link: '',
      children: [
        {
          title: 'My DTR',
          caption: 'Daily Time Record',
          link: '/MyDTR',
          icon: 'timer',
        },
      ],
    },
  ],

}