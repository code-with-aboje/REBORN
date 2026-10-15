// =====================================================
// REBORN - main.js (everything in one file)
// Sections: 1. SCREENS  2. AUTH  3. GAME  4. INTRO  5. START
// =====================================================


// =====================================================
// 1. SCREENS
// showScreen("auth") shows the screen with id="auth" and hides the rest.
// showScreen(null) hides every screen.
// =====================================================
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


// =====================================================
// 2. AUTH (5-step sign up, and log in)
// Steps: 0 account, 1 character, 2 occupation, 3 location, 4 confirm
// =====================================================
let mode = "signup";    // changes between "signup" and "login"
let currentStep = 0;    // which step is showing (0 to 4)

// what the player picks on the card steps
const choices = { character: "", occupation: "", location: "" };

const authTitle   = document.getElementById("authTitle");
const accountBtn  = document.getElementById("accountBtn");
const usernameBox = document.getElementById("username");
const emailBox    = document.getElementById("email");
const passwordBox = document.getElementById("password");
const switchText  = document.getElementById("switch");
const track       = document.getElementById("track");
const dots        = document.querySelectorAll(".dot");

// ---------- remembering the player ----------
// TEMPORARY: a simple flag in the browser so we can test.
// When Supabase is ready, replace these with supabase.auth calls.
function rememberPlayer() {
  localStorage.setItem("reborn_signed_in", "yes");
}

function forgetPlayer() {
  localStorage.removeItem("reborn_signed_in");
}

function isSignedIn() {
  // TODO: replace with supabase.auth.getSession()
  return localStorage.getItem("reborn_signed_in") === "yes";
}

// ---------- slide to a step ----------
function goToStep(number) {
  currentStep = number;

  // slide the track left (step 1 = 0%, step 2 = -100%, and so on)
  track.style.transform = "translateX(-" + (number * 100) + "%)";

  // light up the dot for this step
  for (let i = 0; i < dots.length; i++) {
    if (i == number) {
      dots[i].classList.add("active");
    } else {
      dots[i].classList.remove("active");
    }
  }

  // on the last step, show what the player picked
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

// ---------- step 1: the account form ----------
document.getElementById("accountForm").onsubmit = function (e) {
  e.preventDefault();   // stop the page from reloading

  if (mode === "signup") {
    goToStep(1);        // go to SELECT CHARACTER
  } else {
    logIn();
  }
};

// ---------- steps 2, 3, 4: card pickers ----------
// pickerId = the id of the picker in the HTML
// choiceName = which pick to save ("character", "occupation" or "location")
// nextButtonId = the NEXT button under that picker
function setupPicker(pickerId, choiceName, nextButtonId) {
  const picker = document.getElementById(pickerId);
  const cards = picker.querySelectorAll(".card");
  const cardBox = picker.querySelector(".cards");
  const nextButton = document.getElementById(nextButtonId);

  // tapping a card selects it
  for (let i = 0; i < cards.length; i++) {
    cards[i].onclick = function () {

      // un-select all cards first
      for (let j = 0; j < cards.length; j++) {
        cards[j].classList.remove("selected");
      }

      // then select the tapped one
      cards[i].classList.add("selected");
      choices[choiceName] = cards[i].querySelector(".card-name").textContent;
      nextButton.disabled = false;   // now the player can press NEXT
    };
  }

  // arrows slide the cards left or right
  picker.querySelector(".arrow-left").onclick = function () {
    const amount = cards[0].offsetWidth + 16;   // one card + the gap
    cardBox.scrollBy({ left: -amount, behavior: "smooth" });
  };
  picker.querySelector(".arrow-right").onclick = function () {
    const amount = cards[0].offsetWidth + 16;
    cardBox.scrollBy({ left: amount, behavior: "smooth" });
  };

  // NEXT goes to the next step
  nextButton.onclick = function () {
    goToStep(currentStep + 1);
  };
}

setupPicker("characterPicker",  "character",  "characterNext");
setupPicker("occupationPicker", "occupation", "occupationNext");
setupPicker("locationPicker",   "location",   "locationNext");

// ---------- BACK buttons ----------
const backButtons = document.querySelectorAll(".back-btn");
for (let i = 0; i < backButtons.length; i++) {
  backButtons[i].onclick = function () {
    goToStep(currentStep - 1);
  };
}

// ---------- step 5: BEGIN creates the account ----------
document.getElementById("beginBtn").onclick = function () {
  createAccount();
};

function createAccount() {
  const username = usernameBox.value;
  const email = emailBox.value;
  const password = passwordBox.value;

  // TODO: with Supabase, something like:
  // supabase.auth.signUp({ email: email, password: password,
  //   options: { data: { username: username, character: choices.character,
  //                      occupation: choices.occupation, location: choices.location } } })
  console.log("create account for", username, choices);

  rememberPlayer();   // pretend it worked, for testing
  startGame();
}

function logIn() {
  const email = emailBox.value;
  const password = passwordBox.value;

  // TODO: with Supabase: supabase.auth.signInWithPassword({ email: email, password: password })
  console.log("log in", email);

  rememberPlayer();   // pretend it worked, for testing
  startGame();
}

// ---------- switch between Sign up and Log in ----------
switchText.onclick = function () {
  if (mode === "signup") {
    mode = "login";
    authTitle.textContent = "LOG IN";
    accountBtn.textContent = "LOG IN";
    usernameBox.style.display = "none";   // log in only needs email + password
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


// =====================================================
// 3. GAME (placeholder for now)
// =====================================================

// Runs while the intro plays, so the world loads in the background.
// Put your model / texture loading here later.
function preloadGame() {
  console.log("preloading game assets...");
}

// Shows the game screen and starts the world.
function startGame() {
  showScreen("game");
  console.log("game started");
  // TODO: create your three.js scene here
}

// Log out button (handy for testing the intro again)
document.getElementById("logout").onclick = function () {
  forgetPlayer();
  location.reload();
};


// =====================================================
// 4. INTRO (BlackFox logo -> REBORN title -> sign up)
// Times are in milliseconds (1000 = 1 second).
// =====================================================
const introTimers = [];   // kept so Skip can cancel them

function playIntro() {
  document.getElementById("skip").classList.add("show");

  document.getElementById("logo").classList.add("run");   // starts the fox drawing
  showScreen("logo");

  introTimers.push(setTimeout(function () { showScreen(null); }, 6000));      // logo fades out
  introTimers.push(setTimeout(function () { showScreen("title"); }, 7200));   // REBORN fades in
  introTimers.push(setTimeout(function () { showScreen(null); }, 10200));     // REBORN fades out
  introTimers.push(setTimeout(finishIntro, 11700));                           // sign up appears
}

function finishIntro() {
  for (let i = 0; i < introTimers.length; i++) {
    clearTimeout(introTimers[i]);
  }
  document.getElementById("skip").classList.remove("show");
  showScreen("auth");
}

document.getElementById("skip").onclick = finishIntro;


// =====================================================
// 5. START (runs when the player taps "Tap to start")
// =====================================================
document.getElementById("start").onclick = function () {

  // try fullscreen + landscape (works on Android Chrome, ignored elsewhere)
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().then(function () {
      if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock("landscape").catch(function () {});
      }
    }).catch(function () {});
  }

  preloadGame();

  if (isSignedIn()) {
    startGame();      // returning player: skip the intro
  } else {
    playIntro();      // new player: intro, then sign up
  }
};