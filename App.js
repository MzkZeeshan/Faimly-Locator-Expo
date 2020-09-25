import React from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { Provider } from "react-redux";
import Store from "./redux/Store";
import Navigation from "./navigation/Routes";
import { AppLoading } from "expo";
import { View, Text } from "react-native";

export default class App extends React.Component {
  render() {
    // console.disableYellowBox = true;

    return (
      <Provider store={Store}>
        <PaperProvider>
          <Navigation />
        </PaperProvider>
      </Provider>
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// })
