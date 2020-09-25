const addUser = data => {
  return {
    type: "ADD_USER",
    userInfo: data
  };
};

const loginUser = data => {
  return {
    type: "LOGIN_USER",
    userLogin: data
  };
};
export { addUser, loginUser };
