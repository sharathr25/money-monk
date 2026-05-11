import { NextOrObserver, signInWithPopup, User } from "firebase/auth"
import { auth, googleAuthProvider } from "../firebase"

export const signInWithGoogle = async () => {
  try {
    await signInWithPopup(auth, googleAuthProvider)
    console.log(getLoggedInUser())
  } catch (error: any) {
    console.error(error)
  }
}

export const onAuthStateChanged = (cb: NextOrObserver<User | null>) => {
  auth.onAuthStateChanged(cb)
}

export const getLoggedInUser = () => {
  return auth.currentUser || { uid: "" }
}
