import React, { Component } from "react";
// import {Text,View,StyleSheet,Button,Alert} from 'react-native'
// import { Container, Header, Content, Form, Item, Input, Label ,Button,Text} from 'native-base';
import { Button, TextInput } from "react-native-paper";
import facebook from "../../assets/facebook.png";
import { Image, View, Alert } from "react-native";
import firebase from "../../config/firebase";
import { connect } from "react-redux";
import { loginUser } from "../../redux/Action/userAction";
import { Permissions, Notifications } from "expo";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
      expoToken: null
    };
  }
  async componentDidMount() {
    const { userInfo } = this.state;
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
      console.log("finalStatus", finalStatus);
    }
    let token = await Notifications.getExpoPushTokenAsync();
    var str = token.slice(token.indexOf("[") + 1, token.lastIndexOf("]"));
    this.setState({ expoToken: str });

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }
  }
  async logInFb() {
    const { expoToken } = this.state;
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions
      } = await Expo.Facebook.logInWithReadPermissionsAsync("459143884826224", {
        permissions: ["public_profile", "email"]
      });
      if (type === "success") {
        const credential = firebase.auth.FacebookAuthProvider.credential(token);
        console.log("success", credential);
        firebase
          .auth()
          .signInAndRetrieveDataWithCredential(credential)
          .then(value => {
            const userInfo = {
              name: value.user.displayName,
              email: value.user.email,
              phoneNumber: value.user.phoneNumber,
              photoURL: value.user.photoURL,
              isNewUser: value.additionalUserInfo.isNewUser,
              uid: value.user.uid,
              expoToken: expoToken
            };

            firebase
              .database()
              .ref("userInfo/" + value.user.uid)
              .set(userInfo)
              .then(a => {
                Alert.alert(
                  "Well Come " + value.user.displayName,
                  "You Are SuccessFully Register in nearServices"
                );
                this.props.loginUser(user);
              })
              .catch(error => Alert.alert("Error", error));

            this.props.navigation.navigate("AuthLoading");
            console.log("login time", value);
          })
          .catch(error => {
            Alert.alert("Facebook Login Failed" + error);
            console.log("facebook error", error);
          });

        // Get the user's name using Facebook's Graph API
        //   const response = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,email,name,picture.type(large)`);
        // const a= await  response.json()
        // this.setState({data :a})
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  componentWillReceiveProps(next) {
    console.log("props from Reducer", this.props);
    console.log("props from Reducer next", next);
  }

  render() {
    firebase
      .auth()
      .onAuthStateChanged(u => console.log("user is have after login", u));

    console.log("renderprops", this.props);

    console.log("fb", this.state.data);
    return (
      <View
        style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}
      >
        {/* <TextInput
          label="Email"
          placeholder="Enter Your Email"
          mode="outlined"
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        /> */}
        <Button
          onPress={this.logInFb.bind(this)}
          style={{ height: 55 }}
          color=""
          mode="contained"
        >
          <Image source={facebook} /> Login With facebook
        </Button>
      </View>

      // <View>
      //     <Text>Login</Text>
      //     <Button onPress={this.logInFb.bind(this)} title="Login With Facebook"/>
      // </View>
    );
  }
}

const mapdispatchtooprops = dispatch => {
  return { addUser: data => dispatch(loginUser(data)) };
};
const mapstatetoprops = state => {
  return { user: state.userReducer.userInfo };
};
export default connect(
  mapstatetoprops,
  mapdispatchtooprops
)(Login);
