const recognition = new (window as any).webkitSpeechRecognition() as SpeechRecognition;
recognition.continuous = true;
recognition.interimResults = true;

recognition.addEventListener("start", event => {
  console.log("start", event);
});
recognition.addEventListener("result", event => {
  console.log("result", event);
});
recognition.addEventListener("error", event => {
  console.log("error", event);
});
recognition.addEventListener("end", event => {
  console.log("end", event);
});

const startButton = document.querySelector("button");
console.log(startButton);
if (startButton) {
  recognition.lang = "en-US";
  startButton.addEventListener("click", () => {
    recognition.start();
  });
}
