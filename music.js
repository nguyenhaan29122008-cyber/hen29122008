const music = new Audio("./music.mp3");
music.loop = true;
music.preload = "auto";

window.music = music;

console.log("music loaded:", window.music);