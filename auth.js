import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { firebaseConfig, hasFirebaseConfig } from "./firebase-config.js";

const googleButton = document.getElementById("google-login");
const sendOtpButton = document.getElementById("send-otp");
const verifyOtpButton = document.getElementById("verify-otp");
const phoneInput = document.getElementById("phone-number");
const otpInput = document.getElementById("otp-code");
const statusBox = document.getElementById("auth-status");

let auth;
let confirmationResult;
let recaptchaVerifier;

if (!hasFirebaseConfig) {
  setStatus(
    "Add your real Firebase web app credentials in firebase-config.js before testing Google or OTP login.",
    "info"
  );
  disableAuthActions();
} else {
  const app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  setupGoogleLogin();
  setupOtpLogin();
}

function disableAuthActions() {
  [googleButton, sendOtpButton, verifyOtpButton].forEach((button) => {
    if (button) {
      button.disabled = true;
    }
  });
}

function setupGoogleLogin() {
  const provider = new GoogleAuthProvider();

  googleButton?.addEventListener("click", async () => {
    setStatus("Opening Google sign-in...", "info");

    try {
      const result = await signInWithPopup(auth, provider);
      persistUser(result.user, "google");
      window.location.href = "./welcome.html";
    } catch (error) {
      setStatus(error.message || "Google sign-in failed.", "error");
    }
  });
}

function setupOtpLogin() {
  recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
    size: "normal"
  });

  sendOtpButton?.addEventListener("click", async () => {
    const phoneNumber = phoneInput?.value.trim();

    if (!phoneNumber) {
      setStatus("Please enter your phone number in international format, for example +91 9876543210.", "error");
      return;
    }

    setStatus("Sending OTP...", "info");

    try {
      confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setStatus("OTP sent successfully. Enter the code you received.", "success");
    } catch (error) {
      setStatus(error.message || "Unable to send OTP.", "error");
      try {
        recaptchaVerifier.render().then((widgetId) => {
          window.grecaptcha?.reset(widgetId);
        });
      } catch {
        // Ignore recaptcha reset issues.
      }
    }
  });

  verifyOtpButton?.addEventListener("click", async () => {
    const otpCode = otpInput?.value.trim();

    if (!confirmationResult) {
      setStatus("Send the OTP first before verifying.", "error");
      return;
    }

    if (!otpCode) {
      setStatus("Please enter the OTP code.", "error");
      return;
    }

    setStatus("Verifying OTP...", "info");

    try {
      const result = await confirmationResult.confirm(otpCode);
      persistUser(result.user, "phone");
      window.location.href = "./welcome.html";
    } catch (error) {
      setStatus(error.message || "OTP verification failed.", "error");
    }
  });
}

function persistUser(user, method) {
  const authUser = {
    uid: user.uid,
    displayName: user.displayName || "LexReason Member",
    email: user.email || "",
    phoneNumber: user.phoneNumber || "",
    loginMethod: method
  };

  sessionStorage.setItem("lexreasonAuthUser", JSON.stringify(authUser));
}

function setStatus(message, type) {
  if (!statusBox) {
    return;
  }

  statusBox.className = `form-status show ${type}`;
  statusBox.textContent = message;
}
