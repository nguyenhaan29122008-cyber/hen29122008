import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
query,
orderBy,
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= CONFIG ================= */
const ADMIN_PASS = "Hen5201314@";

/* ================= STATE ================= */
let deleteMode = false;

let groupImages = [];
let privateImages = [];
let privateGallery = null;

/* ================= DELETE BUTTON (PASTEL FIXED UI) ================= */
const trashBtn = document.createElement("div");

trashBtn.innerHTML = `
<svg width="26" height="26" viewBox="0 0 24 24" fill="none">
<path d="M3 6h18" stroke="#ff4d9d" stroke-width="2" stroke-linecap="round"/>
<path d="M8 6V4h8v2" stroke="#ff4d9d" stroke-width="2"/>
<path d="M6 6l1 16h10l1-16" stroke="#ff4d9d" stroke-width="2"/>
</svg>
`;

trashBtn.style.position = "fixed";
trashBtn.style.bottom = "25px";
trashBtn.style.left = "25px";

trashBtn.style.width = "62px";
trashBtn.style.height = "62px";

trashBtn.style.display = "flex";
trashBtn.style.alignItems = "center";
trashBtn.style.justifyContent = "center";

trashBtn.style.cursor = "pointer";

trashBtn.style.borderRadius = "18px";

trashBtn.style.background = `
linear-gradient(135deg,
#ffe4f1,
#ffd6ec,
#fff0f8
)
`;

trashBtn.style.border = "1px solid rgba(255,77,157,0.25)";

trashBtn.style.boxShadow = `
0 10px 25px rgba(255,77,157,0.18),
inset 0 1px 0 rgba(255,255,255,0.6)
`;

trashBtn.style.backdropFilter = "blur(10px)";

trashBtn.style.zIndex = "999999";

trashBtn.style.transition = "0.3s";

/* hover */
trashBtn.onmouseenter = () => {
trashBtn.style.transform = "scale(1.08)";
trashBtn.style.boxShadow = "0 15px 35px rgba(255,77,157,0.25)";
};

trashBtn.onmouseleave = () => {
trashBtn.style.transform = "scale(1)";
trashBtn.style.boxShadow = "0 10px 25px rgba(255,77,157,0.18)";
};

document.body.appendChild(trashBtn);

/* ================= DELETE MODE ================= */
trashBtn.onclick = () => {

if(!deleteMode){

const pass = prompt("Nhập mật khẩu để bật chế độ xóa:");

if(pass !== ADMIN_PASS){
alert("Sai rùi nè ❌");
return;
}

deleteMode = true;
alert("Đã bật chế độ xóa 💗");

}else{

deleteMode = false;
alert("Đã tắt chế độ xóa");

}

};

/* ================= GROUP ================= */
const groupInput = document.getElementById("groupInput");
const groupGallery = document.getElementById("groupGallery");

async function loadGroup(){

groupGallery.innerHTML = "";
groupImages = [];

const q = query(collection(db,"groupPhotos"),orderBy("createdAt","desc"));
const snap = await getDocs(q);

snap.forEach(d=>{

const id = d.id;
const url = d.data().url;

groupImages.push({id,url});

const wrap = document.createElement("div");
wrap.style.position = "relative";

const img = document.createElement("img");
img.src = url;
img.loading = "lazy";

/* VIEW + DELETE */
img.onclick = async () => {

if(deleteMode){

const pass = prompt("Nhập mật khẩu để xóa:");

if(pass !== ADMIN_PASS){
alert("Sai rùi nè ❌");
return;
}

await deleteDoc(doc(db,"groupPhotos",id));
loadGroup();
return;
}

showImage(url);

};

wrap.appendChild(img);
groupGallery.appendChild(wrap);

});

}

loadGroup();

/* UPLOAD GROUP */
groupInput.addEventListener("change", async(e)=>{

const file = e.target.files[0];
if(!file) return;

const form = new FormData();
form.append("file",file);
form.append("upload_preset","hennnn");

const res = await fetch(
"https://api.cloudinary.com/v1_1/ddxeicpk2/image/upload",
{method:"POST",body:form}
);

const data = await res.json();

await addDoc(collection(db,"groupPhotos"),{
url:data.secure_url,
createdAt:serverTimestamp()
});

loadGroup();

});

/* VIEW GROUP */
function showImage(url){

const old = document.querySelector(".image-viewer");
if(old) old.remove();

const overlay = document.createElement("div");
overlay.className = "image-viewer";

overlay.innerHTML = `
<div class="viewer-box">
<img src="${url}" class="viewer-img">
<button class="close-view">✕</button>
</div>
`;

document.body.appendChild(overlay);

overlay.querySelector(".close-view").onclick = () => overlay.remove();

}

/* ================= PRIVATE ================= */
let privateUnlocked = false;

window.openPrivate = function(){

const pass = prompt("🔒 Nhập mật khẩu:");

if(pass !== ADMIN_PASS){
alert("Sai rùi nè ❌");
return;
}

privateUnlocked = true;

document.querySelector(".private-btn")?.remove();
document.getElementById("privateHint").innerText = "💖 Ảnh cá nhân đây rùi";

renderPrivateUI();
loadPrivate();

};

/* CREATE PRIVATE UI */
function renderPrivateUI(){

const box = document.querySelector(".private-card");

const upload = document.createElement("label");
upload.className = "upload-btn";
upload.innerHTML = `
⬆ Upload ảnh cá nhân
<input type="file" accept="image/*">
`;

privateGallery = document.createElement("div");
privateGallery.className = "gallery-grid";

box.appendChild(upload);
box.appendChild(privateGallery);

/* upload */
upload.querySelector("input").addEventListener("change", async(e)=>{

const file = e.target.files[0];
if(!file) return;

const form = new FormData();
form.append("file",file);
form.append("upload_preset","hennnn");

const res = await fetch(
"https://api.cloudinary.com/v1_1/ddxeicpk2/image/upload",
{method:"POST",body:form}
);

const data = await res.json();

await addDoc(collection(db,"privatePhotos"),{
url:data.secure_url,
createdAt:serverTimestamp()
});

loadPrivate();

});

}

/* LOAD PRIVATE */
async function loadPrivate(){

if(!privateGallery) return;

privateGallery.innerHTML = "";
privateImages = [];

const q = query(collection(db,"privatePhotos"),orderBy("createdAt","desc"));
const snap = await getDocs(q);

snap.forEach(d=>{

const id = d.id;
const url = d.data().url;

privateImages.push({id,url});

const wrap = document.createElement("div");
wrap.style.position = "relative";

const img = document.createElement("img");
img.src = url;

/* delete mode */
img.onclick = async () => {

if(deleteMode){

const pass = prompt("Nhập mật khẩu để xóa:");

if(pass !== ADMIN_PASS){
alert("Sai rùi nè ❌");
return;
}

await deleteDoc(doc(db,"privatePhotos",id));
loadPrivate();
return;
}

showImage(url);

};

wrap.appendChild(img);
privateGallery.appendChild(wrap);

});

}