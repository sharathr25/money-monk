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
import { GOALS, USERS } from "./collections"
import type {
  Goal,
  GoalEvent,
  SaveGoalSpec,
  UpdateGoalSpec,
} from "@workspace/core/type/goals"
import { toDate } from "./mapper"

const toGoal = (docSnap: DocumentSnapshot) => {
  const events: GoalEvent[] = docSnap
    .get("events")
    .map((e: DocumentData) => ({ ...e, startDate: toDate(e.startDate) }))

  const state = events[events.length - 1]

  return {
    description: docSnap.get("description"),
    name: docSnap.get("name"),
    icon: docSnap.get("icon"),
    id: docSnap.id,
    createdAt: toDate(docSnap.get("createdAt")),
    updatedAt: toDate(docSnap.get("updatedAt")),
    events,
    state,
  }
}

export const queryGoals = (uid: string) => async (): Promise<Goal[]> => {
  const contraints: QueryCompositeFilterConstraint[] = []

  const q = query(collection(db, USERS, uid, GOALS), and(...contraints))

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(toGoal)
}

export const getGoal =
  (uid: string) =>
  async (id: string): Promise<Goal | null> => {
    const docSnap = await getDoc(doc(db, USERS, uid, GOALS, id))

    if (!docSnap.data()) return null

    return toGoal(docSnap)
  }

export const saveGoal = (uid: string) => async (goal: SaveGoalSpec) => {
  const date = Timestamp.fromDate(new Date())

  const doc: DocumentData = {
    ...goal,
    createdAt: date,
    updatedAt: date,
    events: [
      {
        type: "PLANNED",
        startDate: date,
        amount: goal.estimatedAmount,
      },
    ],
  }

  if (!goal.description) {
    delete doc.description
  }

  delete doc.estimatedAmount

  await addDoc(collection(db, USERS, uid, GOALS), doc)
}

export const updateGoal =
  (uid: string) => async (id: string, goal: UpdateGoalSpec) => {
    const date = new Date()

    const data: DocumentData = {
      ...goal,
      updatedAt: Timestamp.fromDate(date),
    }

    if (!goal.description) {
      delete data.description
    }

    delete data.id

    await setDoc(doc(db, USERS, uid, GOALS, id), data, {
      merge: true,
    })
  }

export const deleteGoal = (uid: string) => async (id: string) => {
  await deleteDoc(doc(db, USERS, uid, GOALS, id))
}
