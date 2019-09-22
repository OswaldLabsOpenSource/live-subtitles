const recognition = new (window as any).webkitSpeechRecognition() as SpeechRecognition;
recognition.continuous = true;
recognition.interimResults = true;
let active = false;

const startButton = document.querySelector("button");
if (startButton) {
  recognition.lang = "en-US";
  startButton.addEventListener("click", () => {
    try {
      recognition.start();
    } catch (error) {
      recognition
    }
  });
}

const update = () => {
  if (startButton) {
    startButton.innerHTML = `${active ? 'Stop' : 'Start'} speaking`;
  }
};

recognition.addEventListener("start", event => {
  active = true;
  update();
});

let fTranscript = "";
recognition.addEventListener("result", event => {
  active = true;
  let iTranscript = "";
  for (let i = event.resultIndex; i < event.results.length; ++i) {
    if (event.results[i].isFinal) {
      fTranscript += event.results[i][0].transcript;
    } else {
      iTranscript += event.results[i][0].transcript;
    }
  }
  const final = document.querySelector(".final");
  if (final) final.innerHTML = fTranscript;
  const interim = document.querySelector(".interim");
  if (interim) interim.innerHTML = iTranscript;
  update();
});
recognition.addEventListener("error", event => {
  active = false;
  update();
});
recognition.addEventListener("end", event => {
  active = false;
  update();
});
