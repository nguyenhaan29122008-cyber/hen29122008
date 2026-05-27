let memories = JSON.parse(localStorage.getItem("memories")||"[]");

function saveData(){
  localStorage.setItem("memories",JSON.stringify(memories));
}