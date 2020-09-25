import React, { Component } from "react";
import { Button } from "react-native-paper";
import { Platform, Text, View, StyleSheet, Alert, Image } from "react-native";
import { Constants, Location, Permissions, MapView, TaskManager } from "expo";
import { connect } from "react-redux";
import firebase from "../../config/firebase";
import timer from "react-native-timer";

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
      initialPosition: {
        latitude: 25.044445405307968,
        longitude: 67.05938044935465
      },
      errorMessage: null,
      loading: false
    };
  }

  // async handleLocationUpdate({ data, error }) {
  //   console.log("location update");
  //   if (error) {
  //     return;
  //   }
  //   if (data) {
  //     try {
  //       const { locations } = data;
  //       console.log("locations", locations);
  //     } catch (error) {
  //       console.log("the error", error);
  //     }
  //   }
  // }

  //   async initializeBackgroundLocation() {
  //     let isRegistered = await TaskManager.isTaskRegisteredAsync(
  //       BACKGROUND_LOCATION_UPDATES_TASK
  //     );
  //     if (!isRegistered)
  //       await Location.startLocationUpdatesAsync(
  //         BACKGROUND_LOCATION_UPDATES_TASK,
  //         {
  //           accuracy: Location.Accuracy.High,
  //           /* after edit */
  //           timeInterval: 2500,
  //           distanceInterval: 5
  //         }
  //       );
  //   }

  //   componentWillMount() {

  //     const BACKGROUND_LOCATION_UPDATES_TASK = "background-location-updates";

  // TaskManager.defineTask(BACKGROUND_LOCATION_UPDATES_TASK, handleLocationUpdate);

  //     initializeBackgroundLocation();
  //     if (Platform.OS === "android" && !Constants.isDevice) {
  //       this.setState({
  //         errorMessage:
  //           "Oops, this will not work on Sketch in an Android emulator. Try it on your device!"
  //       });
  //     } else {
  //       this._getLocationAsync();
  //     }
  //   }

  //   _getLocationAsync = async () => {
  //     let { status } = await Permissions.askAsync(Permissions.LOCATION);
  //     if (status !== "granted") {
  //       this.setState({
  //         errorMessage: "Permission to access location was denied"
  //       });
  //     }
  // timer.setInterval(() =>
  // {
  //    let location= Location.getCurrentPositionAsync({})

  // }, 3000);
  // let location = Location.getCurrentPositionAsync({});

  // console.log("Location change: ", location);
  // this.setState({ location });

  // let location = Location.hasStartedLocationUpdatesAsync({});
  // let location = await Location.getCurrentPositionAsync({});
  // Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_UPDATES_TASK, {
  //   timeInterval: 100
  // });
  // this.setState({ subscriber });
  //   };

  //   componentWillUpdate(nextProps, nextState) {
  //     if (nextState.location[0] == true && this.state.open == false) {
  //       this.props.onWillOpen();
  //     }

  async componentDidMount() {
    // console.log("before----->", this.props.currentLocation);

    firebase
      .database()
      .ref("userInfo/" + this.props.user.uid + "/" + "Rooms/")
      .once("value", snapshot => {
        var arr = [];

        snapshot.forEach(element => {
          var userdata = element.val();
          arr.push({ key: element.key, ...userdata });
          console.log("keeeeeeeeeeeeyyyyyyyyyyyyyyyyyyy", element.key);
          this.setState({ roomId: element.key });
        });
      });

    console.log("chal rha ");
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    let location = await Location.getCurrentPositionAsync({});
    // this.filterClientLocation();
    console.log("lllll", location);

    let initialRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: location.coords.latitude,
      longitudeDelta: location.coords.latitude
    };

    // this.setState({
    //   initialPosition: initialRegion,
    //   markerPostion: initialRegion
    // });

    const BACKGROUND_LOCATION_UPDATE_TASK = "BACKGROUND_LOCATION_UPDATE_TASK";
    let _this = this;

    this.watch = await TaskManager.defineTask(
      BACKGROUND_LOCATION_UPDATE_TASK,
      async ({ data, error }) => {
        if (error) return console.log("error--->", error);

        if (data) {
          try {
            let result = data.locations[0];
            console.log("Backgroundlocation", result);

            let lastRegion = {
              latitude: result.coords.latitude,
              longitude: result.coords.longitude
            };

            _this.setState({
              initialPosition: lastRegion,
              markerPostion: lastRegion
            });

            firebase
              .database()
              .ref(`chatRooms/${this.state.roomId}/coords`)
              .update(lastRegion);
          } catch (err) {
            console.log("backgroundError", err);
          }
        }
      }
    );

    let isRegistered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_LOCATION_UPDATE_TASK
    );
    console.log("register", isRegistered);
    if (!isRegistered) {
      await Location.startLocationUpdatesAsync(
        BACKGROUND_LOCATION_UPDATE_TASK,
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 10,
          distanceInterval: 1
        }
      );
    }
  }

  // finalLocation(c) {
  //   const { location } = this.state;
  //   console.log("location in func", c);
  //   location.coords.latitude = c.latitude;
  //   location.coords.longitude = c.longitude;
  //   this.setState({ location, loading: false });
  // }
  // registerUser() {
  //   const { location } = this.state;
  //   const { user } = this.props;

  //   console.log("locationregister", location.coords);

  //   user.coords = [location.coords.latitude, location.coords.longitude];

  //   console.log("combine", user);
  //   var obj = JSON.parse(
  //     JSON.stringify(user, function(k, v) {
  //       if (v === undefined) {
  //         return null;
  //       }
  //       return v;
  //     })
  //   );

  //   var str = user.uid;
  //   firebase
  //     .database()
  //     .ref("userInfo/" + str)
  //     .set(obj)
  //     .then(a => {
  //       Alert.alert(
  //         "Well Come " + user.name,
  //         "You Are SuccessFully Register in nearServices"
  //       );
  //       this.props.loginUser(user);
  //       this.props.navigation.navigate("Dasboard");
  //     })
  //     .catch(error => Alert.alert("Error", error));
  // }

  render() {
    console.log("stateMap", this.state);
    const { initialPosition, errorMessage, location } = this.state;
    console.log("locationrender", location);
    let text = "Waiting..";
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
    }

    if (initialPosition) {
      return (
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: initialPosition.latitude,
              longitude: initialPosition.longitude,
              latitudeDelta: initialPosition.latitude,
              longitudeDelta: initialPosition.latitude
            }}
          >
            <MapView.Marker
              coordinate={{
                latitude: initialPosition.latitude,
                longitude: initialPosition.longitude
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
            >
              <Image
                source={{ uri: this.props.user.photoURL }}
                style={{
                  width: 30,
                  height: 30,
                  borderTopLeftRadius: 70,
                  borderBottomLeftRadius: 70,
                  borderTopRightRadius: 70
                }}
              />
            </MapView.Marker>
          </MapView>
          <Button
            icon="adb"
            mode="outlined"
            loading={this.state.loading && "true"}
            onPress={() => this.handleLocationUpdate()}
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

// Users.map((item,index)=>{
//   return <MapView.Marker key={index}
//     coordinate={{latitude:item.latitude,
//       longitude:item.longitude}}
// image={{uri:item.img}}
