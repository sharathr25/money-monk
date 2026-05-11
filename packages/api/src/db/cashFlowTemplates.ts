import {
  addDoc,
  collection,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  query,
  QueryConstraint,
  setDoc,
  Timestamp,
  where,
} from "firebase/firestore"
import { db } from "../firebase"
import { CASH_FLOW_TEMPLATES, USERS } from "./collections"
import {
  SaveCashFlowTemplateSpec,
  CashFlowTemplateQuery,
  CashFlowTemplate,
  UpdateCashFlowTemplate,
} from "@workspace/core/type/cashFlowTemplates"
import { getLoggedInUser } from "../auth/index"

export const queryCashFlowTemplates = async ({
  uid,
  type,
}: CashFlowTemplateQuery): Promise<CashFlowTemplate[]> => {
  const contraints: QueryConstraint[] = []

  if (type) {
    contraints.push(where("type", "==", type))
  }

  const q = query(
    collection(db, USERS, uid, CASH_FLOW_TEMPLATES),
    ...contraints
  )

  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map((d) => ({
    description: d.get("description"),
    frequency: d.get("frequency"),
    name: d.get("name"),
    type: d.get("type"),
    amount: d.get("amount"),
    date: d.get("date"),
    icon: d.get("icon"),
    id: d.id,
    createdAt: d.get("createdAt"),
    updatedAt: d.get("updatedAt"),
  }))
}

export const getCashFlowTemplate = async ({
  uid,
  id,
}: {
  uid: string
  id: string
}): Promise<CashFlowTemplate> => {
  const docSnap = await getDoc(doc(db, USERS, uid, CASH_FLOW_TEMPLATES, id))
  return {
    description: docSnap.get("description"),
    frequency: docSnap.get("frequency"),
    name: docSnap.get("name"),
    type: docSnap.get("type"),
    amount: docSnap.get("amount"),
    date: docSnap.get("date"),
    icon: docSnap.get("icon"),
    id: docSnap.id,
    createdAt: docSnap.get("createdAt"),
    updatedAt: docSnap.get("updatedAt"),
  }
}

export const saveCashFlowTemplate = async (
  template: SaveCashFlowTemplateSpec
) => {
  const user = getLoggedInUser()
  if (!user) {
    console.log("Cannot save cash flow template without user")
    return
  }
  const date = new Date()

  const doc: DocumentData = {
    ...template,
    createdAt: Timestamp.fromDate(date),
    updatedAt: Timestamp.fromDate(date),
  }

  if (template.frequency === "ONE_TIME" && template.date) {
    doc.date = Timestamp.fromDate(template.date)
  } else {
    delete doc.date
  }

  if (!template.description) {
    delete doc.description
  }

  await addDoc(collection(db, USERS, user.uid, CASH_FLOW_TEMPLATES), doc)
}

export const updateCashFlowTemplate = async (
  id: string,
  template: UpdateCashFlowTemplate
) => {
  const user = getLoggedInUser()
  if (!user) {
    console.log("Cannot update cash flow template without user")
    return
  }
  const date = new Date()

  const data: DocumentData = {
    ...template,
    updatedAt: Timestamp.fromDate(date),
  }

  if (template.frequency === "ONE_TIME" && template.date) {
    data.date = Timestamp.fromDate(template.date)
  } else {
    delete data.date
  }

  if (!template.description) {
    delete data.description
  }

  delete data.id

  await setDoc(doc(db, USERS, user.uid, CASH_FLOW_TEMPLATES, id), data, {
    merge: true,
  })
}
