import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth"

const auth = getAuth()
const appVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {})

export const signIn = async (phoneNumber: string) => {
  try {
    return await signInWithPhoneNumber(auth, phoneNumber, appVerifier)
  } catch (error) {
    console.error(error)
    return null
  }
}
