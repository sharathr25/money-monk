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
  or,
  query,
  QueryCompositeFilterConstraint,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore"
import { db } from "../firebase"
import { GOALS, USERS } from "./collections"
import type {
  Goal,
  GoalQuery,
  GoalStage,
  SaveGoalSpec,
  UpdateGoalSpec,
} from "@workspace/core/type/goals"
import { toDate } from "./mapper"

const toGoal = (docSnap: DocumentSnapshot) => {
  const stages: GoalStage[] = docSnap
    .get("stages")
    .map((e: DocumentData) => ({ ...e, startDate: toDate(e.startDate) }))

  return {
    id: docSnap.id,
    name: docSnap.get("name"),
    description: docSnap.get("description"),
    icon: docSnap.get("icon"),
    status: docSnap.get("status"),
    estimatedAmount: docSnap.get("estimatedAmount"),
    createdAt: toDate(docSnap.get("createdAt")),
    updatedAt: toDate(docSnap.get("updatedAt")),
    breakdown: docSnap.get("breakdown") || [],
    stages,
  }
}

export const queryGoals =
  (uid: string) =>
  async ({ status }: GoalQuery = {}): Promise<Goal[]> => {
    const contraints: QueryCompositeFilterConstraint[] = []

    if (status && status !== "ALL") {
      contraints.push(
        and(or(...status.split(",").map((s) => where("status", "==", s))))
      )
    }

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

  const docData: DocumentData = {
    ...goal,
    breakdown: goal.breakdown?.map((b) => ({
      ...b,
      id: b.id || doc(collection(db, "breakdown")).id,
    })),
    createdAt: date,
    updatedAt: date,
    stages: [
      {
        status: goal.status,
        startDate: date,
      },
    ],
  }

  if (!goal.description) {
    delete docData.description
  }

  await addDoc(collection(db, USERS, uid, GOALS), docData)
}

export const updateGoal =
  (uid: string) => async (id: string, goal: UpdateGoalSpec) => {
    const date = new Date()

    const data: DocumentData = {
      ...goal,
      breakdown: goal.breakdown?.map((b) => ({
        ...b,
        id: b.id || doc(collection(db, "breakdown")).id,
      })),
      updatedAt: Timestamp.fromDate(date),
    }

    if (!goal.description) {
      delete data.description
    }

    if (goal.status !== goal.stages[goal.stages.length - 1].status) {
      goal.stages.push({
        status: goal.status,
        startDate: date,
      })
    }

    delete data.id

    await setDoc(doc(db, USERS, uid, GOALS, id), data, {
      merge: true,
    })
  }

export const deleteGoal = (uid: string) => async (id: string) => {
  await deleteDoc(doc(db, USERS, uid, GOALS, id))
}
