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
import { CASH_FLOW_TEMPLATES, USERS } from "./collections"
import type {
  SaveCashFlowTemplateSpec,
  CashFlowTemplateQuery,
  CashFlowTemplate,
  UpdateCashFlowTemplate,
} from "@workspace/core/type/cashFlowTemplates"
import { toDate } from "./mapper"

const toCashFlowTemplate = (docSnap: DocumentSnapshot) => ({
  description: docSnap.get("description"),
  goal: docSnap.get("goal"),
  category: docSnap.get("category"),
  counterParty: docSnap.get("counterParty"),
  done: docSnap.get("done"),
  frequency: docSnap.get("frequency"),
  name: docSnap.get("name"),
  type: docSnap.get("type"),
  amount: docSnap.get("amount"),
  date: docSnap.get("date") && toDate(docSnap.get("date")),
  day: docSnap.get("day"),
  icon: docSnap.get("icon"),
  id: docSnap.id,
  createdAt: toDate(docSnap.get("createdAt")),
  updatedAt: toDate(docSnap.get("updatedAt")),
})

export const queryCashFlowTemplates =
  (uid: string) =>
  async ({
    type,
    frequency,
    startDate,
    endDate,
  }: CashFlowTemplateQuery): Promise<CashFlowTemplate[]> => {
    const contraints: QueryCompositeFilterConstraint[] = []

    if (type) {
      contraints.push(and(where("type", "==", type)))
    }

    if (frequency) {
      contraints.push(and(where("frequency", "==", frequency)))
    }

    if (startDate) {
      contraints.push(
        or(where("date", "==", null), where("date", ">=", startDate))
      )
    }

    if (endDate) {
      contraints.push(
        or(where("date", "==", null), where("date", "<=", endDate))
      )
    }

    const q = query(
      collection(db, USERS, uid, CASH_FLOW_TEMPLATES),
      and(...contraints)
    )

    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map(toCashFlowTemplate)
  }

export const getCashFlowTemplate =
  (uid: string) =>
  async ({ id }: { id: string }): Promise<CashFlowTemplate | null> => {
    const docSnap = await getDoc(doc(db, USERS, uid, CASH_FLOW_TEMPLATES, id))

    if (!docSnap.data()) return null

    return toCashFlowTemplate(docSnap)
  }

export const saveCashFlowTemplate =
  (uid: string) => async (template: SaveCashFlowTemplateSpec) => {
    const date = new Date()

    const doc: DocumentData = {
      ...template,
      createdAt: Timestamp.fromDate(date),
      updatedAt: Timestamp.fromDate(date),
    }

    if (template.frequency === "ONE_TIME" && template.date) {
      doc.date = Timestamp.fromDate(template.date)
    } else {
      doc.date = null
    }

    doc.day = template.frequency === "MONTHLY" ? doc.day : null

    if (!template.description) {
      delete doc.description
    }

    await addDoc(collection(db, USERS, uid, CASH_FLOW_TEMPLATES), doc)
  }

export const updateCashFlowTemplate =
  (uid: string) => async (id: string, template: UpdateCashFlowTemplate) => {
    const date = new Date()

    const data: DocumentData = {
      ...template,
      updatedAt: Timestamp.fromDate(date),
    }

    if (template.frequency === "ONE_TIME" && template.date) {
      data.date = Timestamp.fromDate(template.date)
    } else {
      data.date = null
    }

    data.day = template.frequency === "MONTHLY" ? data.day : null

    if (!template.description) {
      delete data.description
    }

    delete data.id

    await setDoc(doc(db, USERS, uid, CASH_FLOW_TEMPLATES, id), data, {
      merge: true,
    })
  }

export const deleteCashFlowTemplate = (uid: string) => async (id: string) => {
  await deleteDoc(doc(db, USERS, uid, CASH_FLOW_TEMPLATES, id))
}
