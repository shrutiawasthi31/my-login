export const firebaseConfig = {
  apiKey: "AIzaSyDcnoENtb_A7zItupufZzR62zWFVq08iC0",
  authDomain: "my-login-432a6.firebaseapp.com",
  projectId: "my-login-432a6",
  storageBucket: "my-login-432a6.firebasestorage.app",
  messagingSenderId: "980619325529",
  appId: "1:980619325529:web:a4f38e6080fada70824148"
};

export const hasFirebaseConfig = Object.values(firebaseConfig).every(
  (value) => value && !String(value).startsWith("REPLACE_WITH_")
);
