import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"
import { getAuth, GoogleAuthProvider } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCqD9YqPa-iIBxXnG5CuKfm64vcPrYajl8",
  authDomain: "money-monk-fcce3.firebaseapp.com",
  projectId: "money-monk-fcce3",
  storageBucket: "money-monk-fcce3.firebasestorage.app",
  messagingSenderId: "71012486470",
  appId: "1:71012486470:web:af5e0a403bf4aecba6e947",
  measurementId: "G-SZ0X7JG9NB",
}

export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const googleAuthProvider = new GoogleAuthProvider()
