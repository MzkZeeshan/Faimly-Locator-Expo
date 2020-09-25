import React from "react";
import Login from "../screens/login/Login";
import NewUser from "../screens/login/NewUser";
import Maps from "../screens/dashboard/Map";

import Loading from "../constant/Loading";
import Dasboard from "../screens/dashboard/Dashboard";

import { IconButton } from "react-native-paper";
import Logout from "../screens/login/Logout";

import {
  createDrawerNavigator,
  createAppContainer,
  createStackNavigator,
  createSwitchNavigator
} from "react-navigation";

// const ChatNavigator = createStackNavigator({
//   ChatList: {
//     screen: ChatList
//   },
//   Chat: {
//     screen: Chat
//   }
// });

const loginItems = createStackNavigator({
  Login: {
    screen: Login
  },
  NewUser: {
    screen: NewUser
  }
});

const dasboardItem = createStackNavigator(
  {
    Home: Dasboard
  },

  {
    initialRouteName: "Home",
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#34003E"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    }
  }
);

// const viewServicesItem = createStackNavigator(
//   {
//     Home: Viewservices
//   },

//   {
//     initialRouteName: "Home",
//     /* The header config from HomeScreen is now here */
//     defaultNavigationOptions: {
//       headerStyle: {
//         backgroundColor: "#ffcd28"
//       },
//       headerTintColor: "#fff",
//       headerTitleStyle: {
//         fontWeight: "bold"
//       }
//     }
//   }
// );

// const addServicesItem = createStackNavigator(
//   {
//     Home: Addservices
//   },

//   {
//     initialRouteName: "Home",
//     /* The header config from HomeScreen is now here */
//     defaultNavigationOptions: {
//       headerStyle: {
//         backgroundColor: "#ffcd28"
//       },
//       headerTintColor: "#fff",
//       headerTitleStyle: {
//         fontWeight: "bold"
//       }
//     }
//   }
// );

const Drawer = createDrawerNavigator(
  {
    Dasboard: {
      screen: dasboardItem
    },
    Map: {
      screen: Maps
    }

    // Logout: {
    //   screen: Logout
    // }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: "#f4511e"
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        fontWeight: "bold"
      }
    }
  }
);
const Navigator = createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: Loading,
      Login: loginItems,
      Dashboard: Drawer
    },

    {
      initialRouteName: "AuthLoading"
    }
  )
);
export default Navigator;
