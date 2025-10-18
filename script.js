function updateTime() {
  const timeEl = document.getElementById("currentTime");
  timeEl.textContent = Date.now();
}

updateTime();
setInterval(updateTime, 1000);
