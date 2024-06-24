export default {
  token: (state) => state.token,
  employee_id: (state) => state.employee_id,
  employee_full_name: (state) => state.employee_full_name,
  isOfficer: (state) => state.isOfficer,
  position: (state) => state.position,
  has_work_experience: (state) => state.has_work_experience,
  is_license: (state) => state.is_license,
  is_pis_approver: (state) => state.access_rights.is_pis_approver,
  is_leave_approver: (state) => state.access_rights.is_leave_approver,
  has_pis_access: (state) => state.access_rights.has_pis_access,
  has_all_values : (state) => {
   if (state.token !== null && state.employee_id !== null && state.employee_full_name !== null){
    return true;
   }
   return false;
  }
};