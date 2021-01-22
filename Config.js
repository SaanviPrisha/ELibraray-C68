import firebase from 'firebase'

require('@firebase/firestore')

var firebaseConfig = {
    apiKey: "AIzaSyCL0bKtu7Q9IXpDVX_Ie3UOs3o8_AYXzaI",
    authDomain: "elibrary-b8761.firebaseapp.com",
    projectId: "elibrary-b8761",
    storageBucket: "elibrary-b8761.appspot.com",
    messagingSenderId: "663737556681",
    appId: "1:663737556681:web:b5a1bf979e1b47edeb7718"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export default firebase.firestore()
