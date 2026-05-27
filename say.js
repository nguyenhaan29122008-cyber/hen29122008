import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ===================== FIREBASE CONFIG ===================== */
const firebaseConfig = {
  apiKey: "AIzaSyBOv-uXXKLDAH30dWekuNzvKYsCo6Fu0OM",
  authDomain: "henn-aa517.firebaseapp.com",
  projectId: "henn-aa517",
  storageBucket: "henn-aa517.firebasestorage.app",
  messagingSenderId: "943972116170",
  appId: "1:943972116170:web:adf302bff4d341b398f633"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messagesRef = collection(db, "messages");

/* ===================== ADMIN ===================== */
let isAdmin = false;

window.openAdmin = function () {
  const popup = document.getElementById("adminPopup");
  if (popup) popup.style.display = "flex";
};

window.closeAdmin = function () {
  const popup = document.getElementById("adminPopup");
  if (popup) popup.style.display = "none";
};

window.checkAdmin = function () {
  const pass = document.getElementById("adminPassword")?.value;

  if (pass === "123456") {
    isAdmin = true;
    alert("🔓 Admin unlocked");
    closeAdmin();
    loadMessages();
  } else {
    alert("Sai mật khẩu 🌸");
  }
};

/* ===================== SEND MESSAGE ===================== */
window.sendMessage = async function () {
  const msg = document.getElementById("msg");

  if (!msg || !msg.value.trim()) return;

  await addDoc(messagesRef, {
    text: msg.value,
    time: serverTimestamp()
  });

  msg.value = "";
  loadMessages();
};

/* ===================== LOAD ALL MESSAGES ===================== */
async function loadMessages() {
  const box = document.getElementById("messages");
  if (!box) return;

  box.innerHTML = "";

  const snapshot = await getDocs(messagesRef);

  snapshot.forEach((d) => {
    const data = d.data();

    const div = document.createElement("div");
    div.className = "card";

    const time = data.time?.toDate
      ? data.time.toDate().toLocaleString("vi-VN")
      : "đang tải...";

    div.innerHTML = `
      <div class="card-text">${data.text}</div>

      .card .time {
  font-size: 14px;
  margin-top: 8px;
  color: #7a6b75;
  font-weight: 600;
  opacity: 1;
  display: block;
}

      ${isAdmin ? `
        <div class="admin-actions">
          <button class="action-btn" onclick="editMsg('${d.id}', \`${data.text}\`)">✏ Sửa</button>
          <button class="action-btn" onclick="deleteMsg('${d.id}')">🗑 Xóa</button>
        </div>
      ` : ""}
    `;

    box.appendChild(div);
  });
}

window.loadMessages = loadMessages;

/* ===================== EDIT (GLOBAL FIREBASE) ===================== */
window.editMsg = async function (id, oldText) {
  const newText = prompt("Sửa nội dung:", oldText);

  if (!newText || !newText.trim()) return;

  await updateDoc(doc(db, "messages", id), {
    text: newText
  });

  loadMessages();
};

/* ===================== DELETE (GLOBAL FIREBASE) ===================== */
window.deleteMsg = async function (id) {
  if (!isAdmin) return;

  if (confirm("Xóa tin nhắn này?")) {
    await deleteDoc(doc(db, "messages", id));
    loadMessages();
  }
};

/* ===================== INIT ===================== */
loadMessages();