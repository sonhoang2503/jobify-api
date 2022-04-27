const checkPermissions = (requestUser, resourceUserId) => {
  if (requestUser.userId === resourceUserId.toString()) {
    return true;
  }else{
    return false;
  }
};

module.exports = checkPermissions;
