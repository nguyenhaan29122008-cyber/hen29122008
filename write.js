import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
serverTimestamp
} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* FIREBASE CONFIG */

const firebaseConfig = {
apiKey: "AIzaSyBOv-uXXKLDAH30dWekuNzvKYsCo6Fu0OM",
authDomain: "henn-aa517.firebaseapp.com",
projectId: "henn-aa517",
storageBucket: "henn-aa517.firebasestorage.app",
messagingSenderId: "943972116170",
appId: "1:943972116170:web:adf302bff4d341b398f633"
};

/* INIT */

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ELEMENTS */

const sendBtn = document.getElementById("sendBtn");
const receiver = document.querySelector(".receiver");
const note = document.getElementById("note");

/* SEND */

sendBtn.addEventListener("click", async () => {

const name = receiver.value.trim();
const content = note.value.trim();

if (!name || !content) {
alert("Viết gì đó trước khi gửi nhé 🌸");
return;
}

try {

await addDoc(collection(db, "memories"), {
from: name,
message: content,
createdAt: serverTimestamp()
});

/* animation 💌 */

const letter = document.createElement("div");
letter.innerHTML = "💌";
letter.style.position = "fixed";
letter.style.left = "50%";
letter.style.bottom = "120px";
letter.style.fontSize = "42px";
letter.style.zIndex = "99999";
letter.style.transition = "1.5s ease";
document.body.appendChild(letter);

setTimeout(() => {
letter.style.transform = "translateY(-300px) rotate(20deg)";
letter.style.opacity = "0";
}, 50);

setTimeout(() => letter.remove(), 1600);

setTimeout(() => {
alert("Đã gửi vào hộp ký ức 🌷");
}, 700);

receiver.value = "";
note.value = "";

} catch (err) {
console.error(err);
alert("Lỗi gửi dữ liệu!");
}

});