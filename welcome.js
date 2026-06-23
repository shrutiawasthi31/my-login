import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig, hasFirebaseConfig } from "./firebase-config.js";

const logoutButton = document.getElementById("logout-button");
const userDetails = document.getElementById("user-details");
const welcomeCopy = document.getElementById("welcome-copy");
const helloTitle = document.getElementById("hello-title");
const helloReply = document.getElementById("hello-reply");
const storedUser = sessionStorage.getItem("lexreasonAuthUser");

let auth = null;

if (hasFirebaseConfig) {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

if (!storedUser) {
  window.location.href = "./index.html";
} else {
  const user = JSON.parse(storedUser);
  const identity = user.email || user.phoneNumber || "LexReason Member";
  const methodLabel = user.loginMethod === "phone" ? "Phone OTP" : "Google";

  welcomeCopy.innerHTML = `Welcome to <span>LexReason</span>`;
  userDetails.textContent = `${identity} | Login method: ${methodLabel}`;
}

helloTitle?.addEventListener("click", () => {
  if (helloReply) {
    helloReply.textContent = "Hey";
  }
});

logoutButton?.addEventListener("click", async (event) => {
  event.preventDefault();
  logoutButton.setAttribute("aria-disabled", "true");
  sessionStorage.removeItem("lexreasonAuthUser");

  if (auth) {
    try {
      await signOut(auth);
    } catch {
      // Ignore logout cleanup errors from Firebase.
    }
  }

  window.location.href = "./index.html?mode=switch-account";
});
