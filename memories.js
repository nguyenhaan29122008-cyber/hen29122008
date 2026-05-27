import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
getFirestore,
collection,
getDocs,
deleteDoc,
doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* FIREBASE */
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

/* ADMIN */
let isAdmin = false;

window.openAdmin = () => {
document.getElementById("adminPopup").style.display = "flex";
};

window.checkAdmin = () => {
const pass = document.getElementById("adminPassword").value;

if (pass === "Hen5201314@") {
isAdmin = true;
document.getElementById("adminPopup").style.display = "none";
loadLetters();
} else {
alert("Sai mật khẩu rùi 🌸");
}
};

/* ===================== FIX DATE FUNCTION ===================== */
function formatDate(timestamp) {
  if (!timestamp) return "Không rõ ngày";

  try {
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString("vi-VN");
    }

    const d = new Date(timestamp);
    if (!isNaN(d)) {
      return d.toLocaleDateString("vi-VN");
    }

    return "Không rõ ngày";
  } catch (e) {
    return "Không rõ ngày";
  }
}

/* OPEN ANIME EFFECT */
function openLetterAnimation(card) {
card.style.transform = "scale(1.05) rotateX(10deg)";
card.style.transition = "0.4s ease";
}

/* LOAD LETTERS */
async function loadLetters() {
const container = document.getElementById("letters");
container.innerHTML = "";

const snapshot = await getDocs(collection(db, "memories"));

snapshot.forEach((docSnap) => {
const data = docSnap.data();

const card = document.createElement("div");
card.className = "letter";

/* ===== FIX DATE ===== */
const date = formatDate(data.createdAt);

/* FRONT */
card.innerHTML = `
<div class="envelope-front">
<div class="shine"></div>

<div class="from">
💌 From: ${data.from || data.name || "Ẩn danh"}
</div>

<div class="date">
📅 ${date}
</div>

<div class="hint">
Chạm để mở ký ức ✨
</div>
</div>
`;

/* CLICK OPEN ANIME STYLE */
card.onclick = () => {

if (!isAdmin) {
alert("🌸 Chỉ Hen mới đọc được lá thư này");
return;
}

/* animation phong bì rạch */
card.innerHTML = `
<div class="envelope-cut">
<div class="knife"></div>
<div class="envelope-left"></div>
<div class="envelope-right"></div>
<div class="paper-fall">💌</div>
</div>
`;

card.classList.add("cutting");

setTimeout(() => {

card.innerHTML = `
<div class="open-letter anime-open">

<h3>💗 ${data.from || data.name || "Ẩn danh"}</h3>

<div class="paper-text typing">
${data.message || "Không có nội dung"}
</div>

<button class="delete-btn">🗑 Xóa ký ức</button>

</div>
`;

/* delete */
const btn = card.querySelector(".delete-btn");

btn.onclick = async (e) => {
e.stopPropagation();
if (!confirm("Xóa lá thư này?")) return;

await deleteDoc(doc(db, "memories", docSnap.id));
loadLetters();
};

}, 900);
};

container.appendChild(card);
});
}

loadLetters();