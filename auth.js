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
  phoneInput?.addEventListener("input", () => {
    clearStatus();
  });

  otpInput?.addEventListener("input", () => {
    clearStatus();
  });

  sendOtpButton?.addEventListener("click", async () => {
    const rawPhoneNumber = phoneInput?.value.trim();
    const phoneNumber = normalizePhoneNumber(rawPhoneNumber);

    if (!phoneNumber) {
      setStatus(
        "Enter a valid phone number. You can use 9876543210, 09876543210, or +919876543210.",
        "error"
      );
      return;
    }

    if (phoneInput) {
      phoneInput.value = phoneNumber;
    }

    setStatus("Sending OTP...", "info");

    try {
      ensureRecaptcha();
      confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      setStatus("OTP sent successfully. Enter the code you received.", "success");
    } catch (error) {
      setStatus(getFriendlyOtpError(error), "error");
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
      setStatus(getFriendlyOtpError(error, "verify"), "error");
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

function normalizePhoneNumber(value) {
  if (!value) {
    return "";
  }

  const cleaned = value.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+") && /^\+[1-9]\d{7,14}$/.test(cleaned)) {
    return cleaned;
  }

  const digits = cleaned.replace(/\D/g, "");

  if (/^\d{10}$/.test(digits)) {
    return `+91${digits}`;
  }

  if (/^0\d{10}$/.test(digits)) {
    return `+91${digits.slice(1)}`;
  }

  if (/^91\d{10}$/.test(digits)) {
    return `+${digits}`;
  }

  return "";
}

function ensureRecaptcha() {
  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "normal"
    });
  }

  return recaptchaVerifier;
}

function getFriendlyOtpError(error, phase = "send") {
  const code = error?.code || "";

  if (code === "auth/invalid-phone-number") {
    return "Use a valid mobile number. Try 9876543210 or +919876543210.";
  }

  if (code === "auth/missing-phone-number") {
    return "Enter your mobile number first.";
  }

  if (code === "auth/captcha-check-failed") {
    return "reCAPTCHA did not complete. Please try Send OTP once more.";
  }

  if (code === "auth/too-many-requests") {
    return "Too many OTP attempts were made. Please wait a little and try again.";
  }

  if (code === "auth/invalid-verification-code") {
    return "The OTP code is incorrect. Please check it and try again.";
  }

  if (code === "auth/code-expired") {
    return "This OTP has expired. Please request a new one.";
  }

  if (phase === "verify") {
    return "OTP verification failed. Please try again.";
  }

  return "Unable to send OTP right now. Please check Firebase Phone sign-in and try again.";
}

function clearStatus() {
  if (!statusBox) {
    return;
  }

  statusBox.className = "form-status";
  statusBox.textContent = "";
}

function setStatus(message, type) {
  if (!statusBox) {
    return;
  }

  statusBox.className = `form-status show ${type}`;
  statusBox.textContent = message;
}
