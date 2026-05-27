import { initializeApp }
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
getStorage
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


const firebaseConfig = {

apiKey:"AIzaSyBOv-uXXKLDAH30dWekuNzvKYsCo6Fu0OM",

authDomain:"henn-aa517.firebaseapp.com",

projectId:"henn-aa517",

storageBucket:"henn-aa517.appspot.com",

messagingSenderId:"943972116170",

appId:"1:943972116170:web:adf302bff4d341b398f633",

measurementId:"G-RZ8WHN4WGK"

};

const app=

initializeApp(
firebaseConfig
);


export const db=

getFirestore(app);


export const storage=

getStorage(app);