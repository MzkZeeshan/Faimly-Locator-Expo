import React, { Component } from "react";
import { Button } from "react-native-paper";
import { Platform, Text, View, StyleSheet, Alert } from "react-native";
import { Constants, Location, Permissions, MapView } from "expo";
import { connect } from "react-redux";
import firebase from "../../config/firebase";

import { loginUser } from "../../redux/Action/userAction";

class Map extends Component {
  // cords  {
  //   latitude: 25.044445405307968,
  //   longitude: 67.05938044935465,
  // }
  constructor(props) {
    super(props);
    this.state = {
      location: {
        coords: {
          latitude: 25.044445405307968,
          longitude: 67.05938044935465
        }
      },
      errorMessage: null,
      loading: false
    };
  }

  componentWillMount() {
    if (Platform.OS === "android" && !Constants.isDevice) {
      this.setState({
        errorMessage:
          "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        errorMessage: "Permission to access location was denied"
      });
    }

    let location = await Location.getCurrentPositionAsync({});

    this.setState({ location });
  };
  finalLocation(c) {
    const { location } = this.state;
    console.log("location in func", c);
    location.coords.latitude = c.latitude;
    location.coords.longitude = c.longitude;
    this.setState({ location, loading: false });
  }
  registerUser() {
    const { location } = this.state;
    const { user } = this.props;

    console.log("locationregister", location.coords);

    user.coords = [location.coords.latitude, location.coords.longitude];

    console.log("combine", user);
    var obj = JSON.parse(
      JSON.stringify(user, function(k, v) {
        if (v === undefined) {
          return null;
        }
        return v;
      })
    );

    var str = user.uid;
    firebase
      .database()
      .ref("userInfo/" + str)
      .set(obj)
      .then(a => {
        Alert.alert(
          "Well Come " + user.name,
          "You Are SuccessFully Register in nearServices"
        );
        this.props.loginUser(user);
        this.props.navigation.navigate("Dasboard");
      })
      .catch(error => Alert.alert("Error", error));
  }

  render() {
    const { location, errorMessage } = this.state;
    console.log("locationrender", location);
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }
    if (location) {
      return (
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
              }}
              title="Your Destination"
              description="Set Your Location"
              onSelect={() => console.log("onSelect")}
              onDrag={() => console.log("onDrag")}
              onDragStart={() => this.setState({ loading: true })}
              onDragEnd={c => {
                this.finalLocation(c.nativeEvent.coordinate);
                console.log("cords end", c.nativeEvent.coordinate);
              }}
              draggable
            />
          </MapView>
          <Button
            icon="adb"
            mode="outlined"
            loading={this.state.loading && "true"}
            onPress={() => this.registerUser()}
          >
            Register
          </Button>
        </View>
      );
    } else {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            fontSize: 40,
            padding: 25,
            fontWeight: "bold"
          }}
        >
          <Text>{errorMessage}</Text>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1"
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: "center"
  }
});

const mapstatetoprops = state => {
  return { user: state.userReducer };
};
const mapdispatchtoprops = dispatch => {
  return { loginUser: data => dispatch(loginUser(data)) };
};
export default connect(
  mapstatetoprops,
  mapdispatchtoprops
)(Map);
