const getters = {
  userInfo: state => state.user.userInfo,
  menuList: state => state.main.menuList,
  activityTypeList: state => state.activity.activityType,
  noteTypeList: state => state.note.noteTypeList,
  deal: state => state.user.permissionsList.deal,
  personal: state => state.user.permissionsList.personal,
  mail: state => state.user.permissionsList.mail,
  activity: state => state.user.permissionsList.activity,
  customManage: state => state.user.permissionsList.customManage,
  companyManage: state => state.user.permissionsList.companyManage,
  lineManage: state => state.user.permissionsList.lineManage,
  permissions: state => state.user.permissions
};
export default getters;
