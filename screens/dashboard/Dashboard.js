import React, { Component } from "react";

import { loginUser } from "../../redux/Action/userAction";
import { connect } from "react-redux";
import { Location, Permissions } from "expo";

// import React from "react";
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Modal,
  Alert
} from "react-native";

import firebase from "../../config/firebase";
import {
  IconButton,
  FAB,
  TextInput,
  Appbar,
  Avatar,
  Card,
  Title,
  Paragraph,
  Button,
  Provider as PaperProvider,
  DataTable,
  Divider
} from "react-native-paper";

class Dasboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      groupListModel: false,
      invitationKey: false,
      invitationKeyText: null,
      location: {
        coords: {
          longitude: 25,
          latitude: 25
        }
      }
    };
  }
  static navigationOptions = props => ({
    headerLeft: (
      <IconButton
        icon="menu"
        color={"white"}
        size={20}
        onPress={() => props.navigation.toggleDrawer()}
      />
    )
  });

  _showModal = () => {
    this.setState({ modalVisible: true });
  };

  createGroup() {
    const { groupName, location } = this.state;
    const { user } = this.props;
    var obj = {
      groupName,
      adminUid: user.uid,
      adminName: user.name,
      adminPhoto: user.photoURL,
      key: Math.random()
        .toString(36)
        .substring(5),
      coords: {
        longitude: location.coords.longitude,
        longitude: location.coords.latitude
      }
    };
    console.log("userdata", user);
    console.log("obj", obj);
    firebase
      .database()
      .ref("Groups/")
      .push(obj)
      .then(() => {
        Alert.alert(
          user.name,
          "Your New Group is Created Invitation key is " + obj.key
        );
      })
      .catch(e => {
        Alert.alert(user.name, "Something Wrong");
      });
    // firebase
    //   .database()
    //   .ref("userInfo/" + user.uid + "/Rooms")
    //   .push(obj)
    //   .then(mykey => {
    //     firebase
    //       .database()
    //       .ref(
    //         "userInfo/" +
    //           user.uid +
    //           "/Rooms/" +
    //           mykey.key +
    //           "/Members/" +
    //           user.uid
    //       )
    //       .set(true);
    //   })
    //   .catch(e => {
    //     console.log("Error", e);
    //   });
  }
  _showKey(i) {
    const { groupData } = this.state;
    groupData[i].keyShow
      ? (groupData[i].keyShow = false)
      : (groupData[i].keyShow = true);
    this.setState({ groupData });
  }

  groupList() {
    {
      console.log("groupdata", this.state.groupData);
      const { user } = this.props;
      return (
        this.state.groupListModel && (
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.groupListModel}
            onRequestClose={() => {
              this.setState({ groupListModel: false });
            }}
          >
            <View>
              <Appbar.Header style={{ backgroundColor: "#34003E", bottom: 14 }}>
                <Appbar.Content
                  style={{ backgroundColor: "#34003E" }}
                  title="Group List"
                />
              </Appbar.Header>
            </View>
            <View>
              {console.log("groupData", this.state.groupData)}
              {this.state.groupData &&
                this.state.groupData.map((v, i) => {
                  return (
                    <Card key={i} style={{ marginBottom: 4, margin: 5 }}>
                      <Card.Title
                        title={v.groupName}
                        subtitle={
                          v.adminName === user.name
                            ? "You are Admin"
                            : "Admin " + v.adminName
                        }
                        left={props => <Avatar.Icon {...props} icon="group" />}
                        right={props => {
                          return v.adminUid === user.uid ? (
                            <IconButton
                              {...props}
                              icon="group-add"
                              onPress={() => this._showKey(i)}
                            />
                          ) : (
                            <View />
                          );
                        }}
                      />
                      {v.keyShow && (
                        <Card.Content>
                          <Title style={{ textAlign: "center" }}>
                            Invite Key is {v.key}
                          </Title>
                        </Card.Content>
                      )}
                    </Card>
                  );
                })}
            </View>
          </Modal>
        )
      );
    }
  }
  async componentDidMount() {
    const { user } = this.props;

    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    let location = await Location.getCurrentPositionAsync({});
    this.setState({ location });

    if (user.uid) {
      console.log("okz");
      var arr = [];
      firebase
        .database()
        .ref("Groups/")
        .on("child_added", snapshot => {
          var userdata = snapshot.val();
          console.log("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", userdata);
          arr.push(userdata);
          this.setState({ groupData: arr });
          // for (var key in userdata) {
          //   arr.push(userdata[key]);
          // }
        });
    }
  }
  createGroupUi() {
    return (
      this.state.modalVisible && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({ modalVisible: false });
          }}
        >
          <Appbar.Header style={{ backgroundColor: "#34003E", bottom: 14 }}>
            <Appbar.Content
              style={{ backgroundColor: "#34003E" }}
              title="Group List"
            />
          </Appbar.Header>

          {/* </Appbar> */}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 20
            }}
          >
            <TextInput
              mode="outlined"
              label="Group Name"
              style={styles.groupNameinput}
              value={this.state.groupName}
              onChangeText={groupName => this.setState({ groupName })}
            />
            <Button
              mode="outlined"
              style={styles.createGrpbtn}
              onPress={() => this.createGroup()}
            >
              Register New Group
            </Button>
          </View>
        </Modal>
      )
    );
  }
  _invitationKey() {
    const { invitationKeyText, location } = this.state;
    const { user } = this.props;
    var memberData = {
      memberUid: user.uid,
      memberCoords: {
        longitude: location.coords.longitude,
        latitude: location.coords.latitude
      },
      memberImage: user.photoURL
    };
    console.log("member Data", memberData);

    firebase
      .database()
      .ref("Groups/")
      .orderByChild("key")
      .equalTo(invitationKeyText)
      .on("child_added", snapshot => {
        console.log("ander aya");
        if (snapshot.key) {
          firebase
            .database()
            .ref("Groups/" + snapshot.key + "/members")
            .push(memberData)
            .then(() => {
              Alert.alert(
                user.name,
                "You are Sucessfull Add in " + snapshot.val().groupName
              );
            })
            .catch(e => console.log("Error", e));
        } else {
          Alert.alert("Error", "Your Invitation key is Invalide");
        }
        console.log("apna", snapshot.val());
      })

      .catch(a => console.log("not ok"));
  }
  enterInvitationKey() {
    return (
      this.state.invitationKey && (
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.invitationKey}
          onRequestClose={() => {
            this.setState({ invitationKey: false });
          }}
        >
          <Appbar.Header style={{ backgroundColor: "#34003E", bottom: 14 }}>
            <Appbar.Content
              style={{ backgroundColor: "#34003E" }}
              title="Invitation Key"
            />
          </Appbar.Header>

          {/* </Appbar> */}
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              padding: 20
            }}
          >
            <TextInput
              mode="outlined"
              label="Enter Your Invitation Key"
              style={styles.groupNameinput}
              value={this.state.invitationKeyText}
              onChangeText={invitationKeyText =>
                this.setState({ invitationKeyText })
              }
            />
            <Button
              mode="outlined"
              style={styles.createGrpbtn}
              onPress={() => this._invitationKey()}
            >
              Registered
            </Button>
          </View>
        </Modal>
      )
    );
  }
  render() {
    console.log("modal", this.state);
    console.log("dashboard", this.props.user);
    console.log("final", this.state.groupData);
    const { user } = this.props;

    return (
      <View style={{ flag: 1, height: "100%" }}>
        {this.groupList()}
        {this.enterInvitationKey()}

        {this.createGroupUi()}

        <FAB.Group
          color="#fff"
          open={this.state.open}
          icon={this.state.open ? "bubble-chart" : "add"}
          actions={[
            {
              icon: "add",
              label: "Create Group",
              onPress: () => this._showModal()
            },
            {
              icon: "playlist-add",
              label: "Invitation key",
              onPress: () => this.setState({ invitationKey: true })
            },

            {
              icon: "group",
              label: "Your Groups",
              onPress: () => this.setState({ groupListModel: true })
            }
          ]}
          onStateChange={({ open }) => this.setState({ open })}
          onPress={() => {
            if (this.state.open) {
              // do something if the speed dial is open
            }
          }}
        />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: "#34003E"
  },
  title: {
    padding: 10
  }
});

const mapStateToProps = state => {
  return { user: state.userReducer };
};

export default connect(
  mapStateToProps,
  {}
)(Dasboard);
