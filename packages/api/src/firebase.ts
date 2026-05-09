import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyCqD9YqPa-iIBxXnG5CuKfm64vcPrYajl8",
  authDomain: "money-monk-fcce3.firebaseapp.com",
  projectId: "money-monk-fcce3",
  storageBucket: "money-monk-fcce3.firebasestorage.app",
  messagingSenderId: "71012486470",
  appId: "1:71012486470:web:af5e0a403bf4aecba6e947",
  measurementId: "G-SZ0X7JG9NB",
}

const initializeFirebase = () => {
  const app = initializeApp(firebaseConfig)
  getAnalytics(app)
  return app
}

const app = initializeFirebase()

export const db = getFirestore(app)
