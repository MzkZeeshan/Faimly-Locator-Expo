import React, { Component } from "react";
import { View, Alert, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ImagePicker, Permissions } from "expo";
import firebase from "../../config/firebase";
import { connect } from "react-redux";
import { addUser } from "../../redux/Action/userAction";
class NewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const { statueof } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  }
  async imageUpload() {
    this.setState({ loading: true });
    // let result = await ImagePicker.launchCameraAsync();
    let result = await ImagePicker.launchImageLibraryAsync();
    console.log("result", result);
    !result.cancelled;
    this.uploadImageAsync(result.uri, "test")
      .then(() => {
        Alert.alert("Uploaded", "Your Image is Uploaded Sucessfully");
      })
      .catch(error => {
        Alert.alert("Error", error);
      });
  }

  async uploadImageAsync(uri) {
    // Why are we using XMLHttpRequest? See:
    // https://github.com/expo/expo/issues/2402#issuecomment-443726662
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = firebase
      .storage()
      .ref()
      .child("images/");
    const snapshot = await ref.put(blob);

    // We're done with the blob, close and release it
    blob.close();

    const dURL = await snapshot.ref.getDownloadURL();
    this.setState({ uri: dURL, loading: false });
    this.props.addUser({ URL: dURL });
  }
  componentWillReceiveProps(next) {
    console.log("props****", next);
  }
  componentDidMount() {
    console.log("user***", this.props.user);
    const number = this.props.user.phoneNumber;
    number && this.setState({ text: number });
  }
  render() {
    console.log("propsrender**", this.props);
    console.disableYellowBox = true;
    console.log("this state uri", this.state.uri);
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <TextInput
          style={style.vs}
          label="Phone No"
          mode="outlined"
          value={this.state.text}
          onChangeText={text => this.setState({ text })}
        />

        <Button
          style={style.vs}
          loading={this.state.loading && "true"}
          icon="add-a-photo"
          mode="contained"
          onPress={() => this.imageUpload()}
        >
          Profile Picture
        </Button>

        <Button
          style={style.vs}
          icon="fast-forward"
          mode="outlined"
          onPress={() => this.props.navigation.navigate("Map")}
        >
          Next
        </Button>
      </View>
    );
  }
}

const style = {
  vs: {
    width: 250,
    margin: 10
  }
};
const mapdispatchtooprops = dispatch => {
  return { addUser: data => dispatch(addUser(data)) };
};
const mapstatetoprops = state => {
  return { user: state.userReducer };
};

export default connect(
  mapstatetoprops,
  mapdispatchtooprops
)(NewUser);
