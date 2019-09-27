const recognition = new (window as any).webkitSpeechRecognition() as SpeechRecognition;
recognition.continuous = true;
recognition.interimResults = true;
let active = false;

const parts = window.location.href.split("#");
if (parts.length === 1) {
  const SLUG = Math.random().toString(36).slice(2);
  window.localStorage.setItem(`is-mine-${SLUG}`, "true");
  window.location.href = `${window.location.href}#${SLUG}`;
}

let SLUG = "example";
try {
  SLUG = window.location.href.split("#")[1];
} catch (error) {}
let isMine = !!window.localStorage.getItem(`is-mine-${SLUG}`);

window.addEventListener("hashchange", () => {
  try {
    SLUG = window.location.href.split("#")[1];
    isMine = !!window.localStorage.getItem(`is-mine-${SLUG}`);
    update();
  } catch (error) {}
});

const startButton = document.querySelector("button");
if (startButton) {
  recognition.lang = "en-US";
  startButton.addEventListener("click", () => {
    try {
      if (active)
        recognition.stop();
      else
        recognition.start();
    } catch (error) {
      recognition.stop();
    }
  });
}

const update = () => {
  if (startButton) {
    startButton.innerHTML = `${active ? 'Stop' : 'Start'} speaking`;
    startButton.classList.remove("active--false");
    startButton.classList.remove("active--true");
    startButton.classList.add(`active--${active}`);
    startButton.classList.remove("mine--false");
    startButton.classList.remove("mine--true");
    startButton.classList.add(`mine--${isMine}`);
  }
  if (!isMine) return;
  // Send date to Firebase
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
  const transcript = `${fTranscript} ${iTranscript}`;
  const p = document.querySelector("p");
  if (p) p.innerHTML = transcript;
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

update();

interface Agastya {
  api(api: "translate", parameter: string): void;
  open(page?: string): void;
}
const translator = document.getElementById("langs") as HTMLSelectElement;
translator.addEventListener("change", () => {
  try {
    if (translator.value === "more")
      ((window as any).agastya as Agastya).api("translate", translator.value);
    else
      ((window as any).agastya as Agastya).open("/pages/translate");
  } catch (error) {
    alert("We're still loading the translation functionality...");
  }
});
