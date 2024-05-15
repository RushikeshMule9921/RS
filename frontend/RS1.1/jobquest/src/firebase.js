import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';

const firebaseConfig = {
  // Your Firebase configuration
  apiKey: "AIzaSyB0FfnoVZgfBAMH4eGNHjRiQdEUUUTHF7Y",
  authDomain: "login-b5ff1.firebaseapp.com",
  projectId: "login-b5ff1",
  storageBucket: "login-b5ff1.appspot.com",
  messagingSenderId: "510270866649",
  appId: "1:510270866649:web:9cb24812ea0febbea7eac8"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export { auth, googleProvider };