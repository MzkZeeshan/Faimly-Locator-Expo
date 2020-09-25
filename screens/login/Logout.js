import React, { Component } from "react";
import { ActivityIndicator, View, Alert } from "react-native";
import firebase from "../../config/firebase";
class Logout extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    firebase
      .auth()
      .signOut()
      .then(function() {
        this.props.navigation.navigate("Auth");
      })
      .catch(function(error) {
        Alert.alert("Logout", "Error In Logout");
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

export default Logout;
