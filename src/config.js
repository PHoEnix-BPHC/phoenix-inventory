import firebase from "firebase"
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyBMfUdCfulcYcTjNkWvJ6d_EoIyI_8-H9U",
    authDomain: "inventory-phoenix.firebaseapp.com",
    projectId: "inventory-phoenix",
    storageBucket: "inventory-phoenix.appspot.com",
    messagingSenderId: "309348531276",
    appId: "1:309348531276:web:1a37558a3eb257237c88e9",
    measurementId: "G-XJKZMEPLRQ"
};

firebase.initializeApp(firebaseConfig)
export const firestore = firebase.firestore()

export default firebase