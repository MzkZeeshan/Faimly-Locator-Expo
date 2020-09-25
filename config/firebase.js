import * as firebase from "firebase";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var config = {
  apiKey: "AIzaSyAdpORfJQTtjHs0sfTZzaPX4rI3o5si3KY",
  authDomain: "familylocator-1.firebaseapp.com",
  databaseURL: "https://familylocator-1.firebaseio.com",
  projectId: "familylocator-1",
  storageBucket: "familylocator-1.appspot.com",
  messagingSenderId: "928229835827"
};
firebase.initializeApp(config);

export default firebase;
