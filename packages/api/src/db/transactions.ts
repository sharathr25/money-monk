import {
  addDoc,
  and,
  collection,
  deleteDoc,
  doc,
  type DocumentData,
  DocumentSnapshot,
  getDoc,
  getDocs,
  query,
  QueryCompositeFilterConstraint,
  setDoc,
  Timestamp,
} from "firebase/firestore"
import { db } from "../firebase"
import { TRANSACTIONS, USERS } from "./collections"
import type {
  Transaction,
  SaveTransationSpec,
  UpdateTransactionSpec,
} from "@workspace/core/type/transactions"
import { toDate } from "./mapper"

const toTransaction = (docSnap: DocumentSnapshot) => {
  return {
    id: docSnap.id,
    goalId: docSnap.get("goalId"),
    templateId: docSnap.get("templateId"),
    name: docSnap.get("name"),
    description: docSnap.get("description"),
    icon: docSnap.get("icon"),
    type: docSnap.get("type"),
    paidTo: docSnap.get("paidTo"),
    amount: docSnap.get("amount"),
    goal: docSnap.get("goal"),
    category: docSnap.get("category"),
    date: toDate(docSnap.get("date")),
    createdAt: toDate(docSnap.get("createdAt")),
    updatedAt: toDate(docSnap.get("updatedAt")),
  }
}

export const queryTransactions =
  (uid: string) => async (): Promise<Transaction[]> => {
    const contraints: QueryCompositeFilterConstraint[] = []

    const q = query(
      collection(db, USERS, uid, TRANSACTIONS),
      and(...contraints)
    )

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(toTransaction)
  }

export const getTransaction =
  (uid: string) =>
  async (id: string): Promise<Transaction | null> => {
    const docSnap = await getDoc(doc(db, USERS, uid, TRANSACTIONS, id))

    if (!docSnap.data()) return null

    return toTransaction(docSnap)
  }

export const saveTransaction =
  (uid: string) => async (transaction: SaveTransationSpec) => {
    const date = Timestamp.fromDate(new Date())

    const docData: DocumentData = {
      ...transaction,
      createdAt: date,
      updatedAt: date,
    }

    if (transaction.goal) {
      docData.goal = { id: transaction.goal.id, name: transaction.goal.name }
    }

    const keysToDelete = [
      ...Object.keys(docData).filter((k) => docData[k] === undefined),
      "id",
      "goalId",
    ]

    keysToDelete.forEach((k) => {
      delete docData[k]
    })

    await addDoc(collection(db, USERS, uid, TRANSACTIONS), docData)
  }

export const updateTransaction =
  (uid: string) => async (id: string, transaction: UpdateTransactionSpec) => {
    const date = new Date()

    const docData: DocumentData = {
      ...transaction,
      updatedAt: Timestamp.fromDate(date),
    }

    if (transaction.goal) {
      docData.goal = { id: transaction.goal.id, name: transaction.goal.name }
    }

    const keysToDelete = [
      ...Object.keys(docData).filter((k) => docData[k] === undefined),
      "id",
      "goalId",
      "categoryId",
    ]

    keysToDelete.forEach((k) => {
      delete docData[k]
    })

    await setDoc(doc(db, USERS, uid, TRANSACTIONS, id), docData, {
      merge: true,
    })
  }

export const deleteTransaction = (uid: string) => async (id: string) => {
  await deleteDoc(doc(db, USERS, uid, TRANSACTIONS, id))
}
