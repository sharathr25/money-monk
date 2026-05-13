import {
  doc,
  type DocumentData,
  getDoc,
  setDoc,
  Timestamp,
} from "firebase/firestore"
import { db } from "../firebase"
import { USERS } from "./collections"
import type { UserData, UserDataUpdateSpec } from "@workspace/core/type/user"
import { DEFAULT } from "@workspace/core/type/index"
import { getLoggedInUser } from "../auth/index"
import { toDate } from "./mapper"

export const getUserData = async (): Promise<UserData | null> => {
  const user = getLoggedInUser()
  if (!user) {
    console.log("Cannot get without user")
    return null
  }

  const docSnap = await getDoc(doc(db, USERS, user.uid))

  return {
    currency: docSnap.get("currency") || DEFAULT.CURRENCY,
    locale: docSnap.get("locale") || DEFAULT.LOCALE,
    openingBalance: docSnap.get("openingBalance") || 0,
    createdAt: toDate(docSnap.get("createdAt")),
    updatedAt: toDate(docSnap.get("updatedAt")),
  }
}

export const updateCashFlowTemplate = async (userData: UserDataUpdateSpec) => {
  const user = getLoggedInUser()
  if (!user) {
    console.log("Cannot update without user")
    return
  }
  const date = new Date()

  const data: DocumentData = {
    ...userData,
    updatedAt: Timestamp.fromDate(date),
  }

  await setDoc(doc(db, USERS, user.uid), data, {
    merge: true,
  })
}
