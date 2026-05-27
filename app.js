console.log("APP JS LOADED");

import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= MUSIC ================= */
const music = new Audio("./music.mp3");
music.loop = true;
music.preload = "auto";
music.volume = 1;

window.music = music;

let musicStarted = false;

async function startMusic() {
  try {
    await music.play();
    musicStarted = true;
  } catch (err) {
    console.log(err);
  }
}

document.addEventListener(
  "click",
  () => {
    if (!musicStarted) startMusic();
  },
  { once: true }
);

window.testMusic = function () {
  music.play();
};

/* ================= ADMIN ================= */
let adminMode = false;

window.openAdmin = function () {
  document.getElementById("adminPopup").style.display = "flex";
};

window.closeAdmin = function () {
  document.getElementById("adminPopup").style.display = "none";
};

window.checkAdmin = function () {
  const pass = document.getElementById("adminPassword").value;

  if (pass === "Hen5201314@") {
    adminMode = true;
    alert("Đăng nhập admin thành công ✨");
    closeAdmin();
  } else {
    alert("Sai rùi nè");
  }
};

/* ================= SEND MESSAGE ================= */
window.sendMessage = async function () {
  const input = document.getElementById("msg");
  const text = input.value.trim();

  if (!text) return;

  await addDoc(collection(db, "messages"), {
    text,
    createdAt: serverTimestamp()
  });

  input.value = "";
};

/* ================= LOAD MESSAGES ================= */
function loadMessages() {
  const container = document.getElementById("messages");

  const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snapshot) => {
    container.innerHTML = "";

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();

      const card = document.createElement("div");
      card.className = "card";

      /* TEXT */
      const textDiv = document.createElement("div");
      textDiv.className = "card-text";
      textDiv.textContent = data.text;

      card.appendChild(textDiv);

      /* TIME */
      const timeDiv = document.createElement("div");
      timeDiv.style.fontSize = "13px";
      timeDiv.style.opacity = "0.6";
      timeDiv.style.marginTop = "6px";

      const time = data.createdAt?.toDate?.();
      timeDiv.textContent = time
        ? time.toLocaleString("vi-VN")
        : "Đang xử lý...";

      card.appendChild(timeDiv);

      /* ADMIN ACTIONS */
      if (adminMode) {
        const actions = document.createElement("div");
        actions.className = "admin-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "action-btn";
        editBtn.textContent = "✏ Sửa";

        editBtn.onclick = async () => {
          const newText = prompt("Sửa nội dung:", data.text);
          if (newText) {
            await updateDoc(doc(db, "messages", docSnap.id), {
              text: newText
            });
          }
        };

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "action-btn";
        deleteBtn.textContent = "🗑 Xóa";

        deleteBtn.onclick = async () => {
          if (confirm("Xóa tin nhắn này?")) {
            await deleteDoc(doc(db, "messages", docSnap.id));
          }
        };

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        card.appendChild(actions);
      }

      container.appendChild(card);
    });
  });
}

/* ================= INIT ================= */
loadMessages();

/* ================= RELOAD WHEN ADMIN ENABLE ================= */
setInterval(() => {
  if (adminMode) {
    loadMessages();
  }
}, 3000);