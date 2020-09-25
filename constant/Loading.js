import React, { Component } from "react";
import { ActivityIndicator, View, Text } from "react-native";
import firebase from "../config/firebase";
import { connect } from "react-redux";
import { addUser, loginUser } from "../redux/Action/userAction";
class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {
    await firebase.auth().onAuthStateChanged(user => {
      console.log("loading**", user);
      if (user) {
        fetch(
          `https://familylocator-1.firebaseio.com/userInfo/${user.uid}.json`
        )
          .then(a => a.json())
          .then(a => {
            const userInfo = {
              name: user.displayName,
              email: user.email,
              phoneNumber: user.phoneNumber,
              photoURL: user.photoURL,
              uid: user.uid
            };
            console.log("data agaya", a);
            a &&
              this.props.loginUser(a) &&
              this.props.navigation.navigate("Dashboard");
            !a &&
              this.props.addUser(userInfo) &&
              this.props.navigation.navigate("NewUser");
          });
      } else {
        this.props.navigation.navigate("Login");
      }
    });
  }
  render() {
    return (
      <View
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addUser: data => dispatch(addUser(data)),
    loginUser: data => dispatch(loginUser(data))
  };
};
const mapStateToProps = state => {
  return { user: state.userReducer };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading);
