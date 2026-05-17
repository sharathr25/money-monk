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
import { toDate } from "./mapper"

export const getUserData = async (uid: string): Promise<UserData> => {
  const docSnap = await getDoc(doc(db, USERS, uid))

  return {
    currency: docSnap.get("currency") || DEFAULT.CURRENCY,
    locale: docSnap.get("locale") || DEFAULT.LOCALE,
    openingBalance: docSnap.get("openingBalance") || 0,
    createdAt: docSnap.get("createdAt") && toDate(docSnap.get("createdAt")),
    updatedAt: docSnap.get("updatedAt") && toDate(docSnap.get("updatedAt")),
  }
}

export const updateUserData =
  (uid: string) => async (userData: UserDataUpdateSpec) => {
    const date = new Date()

    const data: DocumentData = {
      ...userData,
      updatedAt: Timestamp.fromDate(date),
    }

    await setDoc(doc(db, USERS, uid), data, {
      merge: true,
    })
  }
