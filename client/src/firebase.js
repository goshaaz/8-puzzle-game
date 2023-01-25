import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyB9Ix-IlacNMJJI7yiB9I0vF1fYIQMfUyA',
    authDomain: 'tddd27ecomm.firebaseapp.com',
    databaseURL: 'https://tddd27ecomm-default-rtdb.firebaseio.com',
    projectId: 'tddd27ecomm',
    storageBucket: 'tddd27ecomm.appspot.com',
    messagingSenderId: '462309358018',
    appId: '1:462309358018:web:3184ad602cea0de7fb3e5b',
    measurementId: 'G-5K05SC7HS6',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;
