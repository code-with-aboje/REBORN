// ---------- screens ----------
function showScreen(name) {
  const screens = document.querySelectorAll(".screen");

  for (let i = 0; i < screens.length; i++) {
    if (screens[i].id == name) {
      screens[i].classList.add("show");
    } else {
      screens[i].classList.remove("show");
    }
  }
}


// ---------- auth ----------
let mode = "signup";
let currentStep = 0;

const choices = { character: "", occupation: "", location: "" };

const authTitle   = document.getElementById("authTitle");
const accountBtn  = document.getElementById("accountBtn");
const usernameBox = document.getElementById("username");
const emailBox    = document.getElementById("email");
const passwordBox = document.getElementById("password");
const switchText  = document.getElementById("switch");
const track       = document.getElementById("track");
const dots        = document.querySelectorAll(".dot");

// temporary, replace with Supabase later
function rememberPlayer() {
  localStorage.setItem("reborn_signed_in", "yes");
}

function forgetPlayer() {
  localStorage.removeItem("reborn_signed_in");
}

function isSignedIn() {
  return localStorage.getItem("reborn_signed_in") === "yes";
}

function goToStep(number) {
  currentStep = number;
  track.style.transform = "translateX(-" + (number * 100) + "%)";

  for (let i = 0; i < dots.length; i++) {
    if (i == number) {
      dots[i].classList.add("active");
    } else {
      dots[i].classList.remove("active");
    }
  }

  if (number == 4) {
    fillSummary();
  }
}

function fillSummary() {
  document.getElementById("sumName").textContent = usernameBox.value;
  document.getElementById("sumCharacter").textContent = choices.character;
  document.getElementById("sumOccupation").textContent = choices.occupation;
  document.getElementById("sumLocation").textContent = choices.location;
}

document.getElementById("accountForm").onsubmit = function (e) {
  e.preventDefault();

  if (mode === "signup") {
    goToStep(1);
  } else {
    logIn();
  }
};

function setupPicker(pickerId, choiceName, nextButtonId) {
  const picker = document.getElementById(pickerId);
  const cards = picker.querySelectorAll(".card");
  const cardBox = picker.querySelector(".cards");
  const nextButton = document.getElementById(nextButtonId);

  for (let i = 0; i < cards.length; i++) {
    cards[i].onclick = function () {
      for (let j = 0; j < cards.length; j++) {
        cards[j].classList.remove("selected");
      }

      cards[i].classList.add("selected");
      choices[choiceName] = cards[i].querySelector(".card-name").textContent;
      nextButton.disabled = false;
    };
  }

  picker.querySelector(".arrow-left").onclick = function () {
    const amount = cards[0].offsetWidth + 16;
    cardBox.scrollBy({ left: -amount, behavior: "smooth" });
  };

  picker.querySelector(".arrow-right").onclick = function () {
    const amount = cards[0].offsetWidth + 16;
    cardBox.scrollBy({ left: amount, behavior: "smooth" });
  };

  nextButton.onclick = function () {
    goToStep(currentStep + 1);
  };
}

setupPicker("characterPicker",  "character",  "characterNext");
setupPicker("occupationPicker", "occupation", "occupationNext");
setupPicker("locationPicker",   "location",   "locationNext");

const backButtons = document.querySelectorAll(".back-btn");
for (let i = 0; i < backButtons.length; i++) {
  backButtons[i].onclick = function () {
    goToStep(currentStep - 1);
  };
}

document.getElementById("beginBtn").onclick = function () {
  createAccount();
};

function createAccount() {
  console.log("create account for", usernameBox.value, choices);

  // TODO: supabase.auth.signUp(...)
  rememberPlayer();
  startGame();
}

function logIn() {
  console.log("log in", emailBox.value);

  // TODO: supabase.auth.signInWithPassword(...)
  rememberPlayer();
  startGame();
}

switchText.onclick = function () {
  if (mode === "signup") {
    mode = "login";
    authTitle.textContent = "LOG IN";
    accountBtn.textContent = "LOG IN";
    usernameBox.style.display = "none";
    usernameBox.required = false;
    document.getElementById("dots").style.visibility = "hidden";
    switchText.innerHTML = 'New here? <span>Create account</span>';
  } else {
    mode = "signup";
    authTitle.textContent = "CREATE ACCOUNT";
    accountBtn.textContent = "NEXT";
    usernameBox.style.display = "";
    usernameBox.required = true;
    document.getElementById("dots").style.visibility = "visible";
    switchText.innerHTML = 'Already have an account? <span>Log in</span>';
  }
};


// ---------- game ----------
// startGame() lives in game.js
function preloadGame() {
  console.log("preloading game assets...");
}

document.getElementById("logout").onclick = function () {
  forgetPlayer();
  location.reload();
};


// ---------- intro ----------
const introTimers = [];

function playIntro() {
  document.getElementById("skip").classList.add("show");
  document.getElementById("logo").classList.add("run");
  showScreen("logo");

  introTimers.push(setTimeout(function () { showScreen(null); }, 6000));
  introTimers.push(setTimeout(function () { showScreen("title"); }, 7200));
  introTimers.push(setTimeout(function () { showScreen(null); }, 10200));
  introTimers.push(setTimeout(finishIntro, 11700));
}

function finishIntro() {
  for (let i = 0; i < introTimers.length; i++) {
    clearTimeout(introTimers[i]);
  }
  document.getElementById("skip").classList.remove("show");
  showScreen("auth");
}

document.getElementById("skip").onclick = finishIntro;


// ---------- start ----------
document.getElementById("start").onclick = function () {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().then(function () {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(function () {});
      }
    }).catch(function () {});
  }

  preloadGame();

  if (isSignedIn()) {
    startGame();
  } else {
    playIntro();
  }
};