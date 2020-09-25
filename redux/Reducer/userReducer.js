const userReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER":
      return { ...state, ...action.userInfo };

    case "LOGIN_USER":
      return { state, ...action.userLogin };

    default:
      return { ...state };
  }
};

export default userReducer;
