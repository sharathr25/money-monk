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
  limit,
  or,
  orderBy,
  query,
  QueryCompositeFilterConstraint,
  QueryLimitConstraint,
  QueryOrderByConstraint,
  setDoc,
  where,
} from "firebase/firestore"
import { db } from "../firebase"
import { TRANSACTIONS, USERS } from "./collections"
import type {
  Transaction,
  SaveTransationSpec,
  UpdateTransactionSpec,
  TransactionQuery,
} from "@workspace/core/type/transactions"
import { toDate } from "./mapper"

const toTransaction = (docSnap: DocumentSnapshot) => {
  return {
    id: docSnap.id,
    name: docSnap.get("name"),
    description: docSnap.get("description"),
    icon: docSnap.get("icon"),
    type: docSnap.get("type"),
    counterParty: docSnap.get("counterParty"),
    amount: docSnap.get("amount"),
    goal: docSnap.get("goal"),
    category: docSnap.get("category"),
    status: docSnap.get("status"),
    frequency: docSnap.get("frequency"),
    plannedDate: docSnap.get("plannedDate")
      ? toDate(docSnap.get("plannedDate"))
      : undefined,
    completedDate: docSnap.get("completedDate")
      ? toDate(docSnap.get("completedDate"))
      : undefined,
    createdAt: toDate(docSnap.get("createdAt")),
    updatedAt: toDate(docSnap.get("updatedAt")),
  }
}

export const queryTransactions =
  (uid: string) =>
  async (transactionQuery: TransactionQuery): Promise<Transaction[]> => {
    const contraints: QueryCompositeFilterConstraint[] = []
    const orderByConstraints: QueryOrderByConstraint[] = []
    const limitContraints: QueryLimitConstraint[] = []

    if (transactionQuery?.goalId) {
      contraints.push(and(where("goal.id", "==", transactionQuery.goalId)))
    }

    if (transactionQuery?.categoryId) {
      contraints.push(
        and(where("category.id", "==", transactionQuery.categoryId))
      )
    }

    if (transactionQuery?.frequency) {
      contraints.push(and(where("frequency", "==", transactionQuery.frequency)))
    }

    if (transactionQuery?.type) {
      contraints.push(and(where("type", "==", transactionQuery.type)))
    }

    if (transactionQuery?.limit) {
      limitContraints.push(limit(transactionQuery.limit))
    }

    if (transactionQuery?.orderBy) {
      orderByConstraints.push(orderBy(transactionQuery.orderBy))
    }

    if (transactionQuery?.plannedStartDate) {
      contraints.push(
        or(
          and(
            where("frequency", "==", "ONE_TIME"),
            where("plannedDate", ">=", transactionQuery.plannedStartDate)
          ),
          where("frequency", "==", "MONTHLY")
        )
      )
    }

    if (transactionQuery?.plannedEndDate) {
      contraints.push(
        or(
          and(
            where("frequency", "==", "ONE_TIME"),
            where("plannedDate", "<=", transactionQuery.plannedEndDate)
          ),
          where("frequency", "==", "MONTHLY")
        )
      )
    }

    if (transactionQuery?.status) {
      contraints.push(and(where("status", "==", transactionQuery.status)))
    }

    if (transactionQuery?.plannedDateExists) {
      contraints.push(and(where("plannedDate", "!=", null)))
    }

    const q = query(
      collection(db, USERS, uid, TRANSACTIONS),
      and(...contraints),
      ...orderByConstraints,
      ...limitContraints
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
    const date = new Date()

    const docData: DocumentData = {
      ...transaction,
      createdAt: date,
      updatedAt: date,
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

    await addDoc(collection(db, USERS, uid, TRANSACTIONS), docData)
  }

export const updateTransaction =
  (uid: string) => async (id: string, transaction: UpdateTransactionSpec) => {
    const docData: DocumentData = {
      ...transaction,
      updatedAt: new Date(),
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
