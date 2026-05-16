import { type NextOrObserver, signInWithPopup, type User } from "firebase/auth"
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

export const getLoggedInUser = (): User | null => {
  return auth.currentUser
}

export const signOut = async () => {
  auth.signOut()
}
