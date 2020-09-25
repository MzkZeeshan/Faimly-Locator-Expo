import React from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Modal,
  Alert
} from "react-native";
import { Facebook } from "expo";
import * as firebase from "firebase";
import {
  FAB,
  TextInput,
  Appbar,
  Avatar,
  Card,
  Title,
  Paragraph,
  Button,
  Provider as PaperProvider
} from "react-native-paper";
// import firebase from './firebase';
// import * as firebase from 'firebase';
// import Map from './map'
console.disableYellowBox = true;

export default class Dashboard extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: "#27A9E1",
      shadowColor: "white",
      elevation: 0
      // padddingLeft: 70
    },
    headerTintColor: "white",
    title: "Tracking App",
    drawerLabel: "Dashboard"
    // drawerLabel: 'Login'
  };
  constructor(props) {
    super(props);
    this.state = {
      createGroupmodal: false,
      modalVisible: false,
      groupName: "",
      loggedInusername: "",
      loggedInuserimage: "",
      loggedInuserid: "",
      abc: false
    };
  }

  _retrieveLoggedinusername = async () => {
    // console.log('retrieve ka function')
    try {
      const value = await AsyncStorage.getItem("Currentusername");
      if (value != null) {
        // We have data!!
        console.log("Logged In User Name", value);
        this.setState({
          loggedInusername: value
        });
      }
    } catch (error) {
      // Error retrieving data
      console.log("no logged in user name found");
    }
  };

  _retrieveLoggedinuserid = async () => {
    console.log("retrieve ka function");
    try {
      const value = await AsyncStorage.getItem("Currentuser");
      if (value != null) {
        // We have data!!
        console.log("Logged in user id", value);
        this.setState({
          loggedInuserid: value,
          abc: true
        });
      }
    } catch (error) {
      // Error retrieving data
      console.log("Logged in user id could not found");
    }
  };

  _retrieveLoggedinuserimage = async () => {
    try {
      const value = await AsyncStorage.getItem("Currentuserimage");
      if (value !== null) {
        this.setState({ loggedInuserimage: value });
        // We have data!!
        console.log("Logged in user image found", value);
      }
    } catch (error) {
      console.log("Logged in user image could not found");

      // Error retrieving data
    }
  };

  componentWillMount() {
    this._retrieveLoggedinuserimage();
    this._retrieveLoggedinusername();
    this._retrieveLoggedinuserid();
  }

  componentDidMount() {
    // const { loggedInuserid } = this.state;
    // firebase.database().ref("users/" + this.state.loggedInuserid + "/" + "Rooms/").once("value", (snapshot) => {
    //     var arr = [];
    //     var userdata = snapshot.val();
    //     console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",userdata)
    //     for (var key in userdata) {
    //         arr.push(userdata[key]);
    //     }
    //     this.setState({ arr })
    // })
  }

  _showModal = () => {
    this.setState({ modalVisible: true });
  };
  _hideModal = () => this.setState({ modalVisible: false });

  createGroup() {
    const {
      groupName,
      loggedInusername,
      loggedInuserimage,
      loggedInuserid
    } = this.state;
    var obj = {
      groupName,
      loggedInusername,
      loggedInuserimage,
      loggedInuserid
    };
    firebase
      .database()
      .ref("Rooms/")
      .push(obj)
      .then(mykey1 => {
        firebase
          .database()
          .ref("Rooms/" + mykey1.key + "/Members/" + loggedInuserid)
          .set(true);
      })
      .catch(e => {
        console.log("Errors", e);
      });
    firebase
      .database()
      .ref("users/" + loggedInuserid + "/Rooms")
      .push(obj)
      .then(mykey => {
        firebase
          .database()
          .ref(
            "users/" +
              loggedInuserid +
              "/Rooms/" +
              mykey.key +
              "/Members/" +
              loggedInuserid
          )
          .set(true);
      })
      .catch(e => {
        console.log("Error", e);
      });
  }
  render() {
    if (this.state.loggedInuserid != null && this.state.abc == true) {
      firebase
        .database()
        .ref("users/" + this.state.loggedInuserid + "/" + "Rooms/")
        .once("value", snapshot => {
          var arr = [];
          var userdata = snapshot.val();
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", userdata);
          for (var key in userdata) {
            arr.push(userdata[key]);
          }
          this.setState({ arr, abc: !this.state.abc });
        });
    }
    const { arr } = this.state;
    return (
      <PaperProvider>
        {/* <Text>Dashboard</Text> */}
        {/* <View style={styles.avatarview}>
                    <Avatar.Text size={154} label="+" />
                    <Avatar.Text size={154} label="+" />
                </View> */}

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            this._hideModal();
          }}
        >
          {/* <Appbar style={styles.bottom}> */}
          {/* <Appbar.Action icon="archive" onPress={() => console.log('Pressed archive')} /> */}
          <Appbar.Header>
            {/* <Appbar.BackAction
          onPress={this._goBack}
        /> */}
            <Appbar.Content title="Create New Group" />
            {/* <Appbar.Action icon="search" onPress={this._onSearch} />
        <Appbar.Action icon="more-vert" onPress={this._onMore} /> */}
          </Appbar.Header>
          {/* </Appbar> */}
          <View style={styles.modalview}>
            <View>
              <TextInput
                mode="outlined"
                label="Group Name"
                style={styles.groupNameinput}
                value={this.state.groupName}
                onChangeText={groupName => this.setState({ groupName })}
              />
              <Button
                mode="contained"
                style={styles.createGrpbtn}
                onPress={() => this.createGroup()}
              >
                Create Group
              </Button>
              {/* <Button mode="contained" color='#f44336' style={styles.requestbtn} onPress={() => {
                                            this._hideModal()
                                        }}>Cancel Request</Button> */}
            </View>
          </View>
        </Modal>
        {this.state.arr != null &&
          arr.map((data, i) => {
            return (
              <View style={styles.card} key={i}>
                <Text>Group Name:{data.groupName}</Text>
                <Text>Group Creator:{data.loggedInusername}</Text>
                <View style={styles.btnview}>
                  <Button mode="contained" style={styles.opemgrpbtn}>
                    <Text>Open Group</Text>
                  </Button>
                  <Button mode="contained" style={styles.newmemberbtn}>
                    <Text>Invite New Member</Text>
                  </Button>
                </View>
                <View />
              </View>
            );
          })}
        {/* </View> */}
        <FAB.Group
          open={this.state.open}
          icon={this.state.open ? "today" : "add"}
          actions={[
            {
              icon: "add",
              label: "Join Group",
              onPress: () => console.log("Join Group")
            },
            {
              icon: "add",
              label: "Create Group",
              onPress: () => this._showModal()
            }
            // { icon: 'star', label: 'Create Group', onPress: () => console.log('Pressed star')},
            // { icon: 'email', label: 'Join Group', onPress: () => console.log('Pressed email') },
            // { icon: 'notifications', label: 'Remind', onPress: () => console.log('Pressed notifications') },
          ]}
          onStateChange={({ open }) => this.setState({ open })}
          onPress={() => {
            if (this.state.open) {
              // do something if the speed dial is open
            }
          }}
        />
        {/* <FAB
                    style={styles.fab}
                    icon="add"
                    onPress={() => console.log('Pressed')}
                /> */}
      </PaperProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    //  backgroundColor: '#00aeef',
    borderColor: "#27A9E1",
    marginLeft: 10,
    marginTop: 8,
    marginRight: 10,
    marginBottom: 4,
    borderColor: "#27A9E1",
    borderWidth: 2,
    borderRadius: 5,
    paddingLeft: 16,
    paddingTop: 5.5,
    paddingBottom: 8
  },
  btnview: {
    flexDirection: "row"
  },
  opemgrpbtn: {
    width: 200
  },
  newmemberbtn: {
    marginLeft: 35
    //   backgroundColor:
  },
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0
  },
  avatarview: {
    flexDirection: "row"
  },
  groupNameinput: {
    width: 450
  },
  modalview: {
    marginLeft: 15
  },
  createGrpbtn: {
    width: 270,
    marginTop: 20
  }
});
