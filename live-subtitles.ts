const recognition = new (window as any).webkitSpeechRecognition() as SpeechRecognition;
recognition.continuous = true;
recognition.interimResults = true;
let active = false;

import * as firebase from "firebase/app";
import "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyD7n1YDWmEB3oX9B6NF51Gwaesjd4JoPyo",
  authDomain: "live-subtitles-web.firebaseapp.com",
  databaseURL: "https://live-subtitles-web.firebaseio.com"
};
firebase.initializeApp(firebaseConfig);

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
    startButton.classList.remove("active--false", "active--true");
    startButton.classList.add(`active--${active}`);
    startButton.classList.remove("mine--false", "mine--true");
    startButton.classList.add(`mine--${isMine}`);
  }
  if (!isMine) return;
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
  firebase.database().ref("text").set(transcript);
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
  const agastyaApi = ((window as any).agastya as Agastya);
  try {
    if (translator.value === "more")
      agastyaApi.open("/modes/translate");
    else
      agastyaApi.api("translate", translator.value);
  } catch (error) {
    alert("We're still loading the translation functionality...");
  }
});

const sharer = document.querySelector(".share");
if (sharer) {
  sharer.addEventListener("click", () => {
    if ((navigator as any).share) {
      (navigator as any).share({
          title: "Live Subtitles",
          text: "Follow live captions",
          url: location.href,
      })
        .then(() => {})
        .catch(() => {})
    }
  });
}

const ref = firebase.database().ref("text");
ref.on("value", function(snapshot) {
  const p = document.querySelector("p");
  if (p) p.innerHTML = snapshot.val();
});
