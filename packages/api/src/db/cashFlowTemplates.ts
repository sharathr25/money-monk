import {
  addDoc,
  collection,
  DocumentData,
  getDocs,
  query,
  QueryConstraint,
  Timestamp,
  where,
} from "firebase/firestore"
import { db } from "../firebase"
import { CASH_FLOW_TEMPLATES, USERS } from "./collections"
import {
  SaveCashFlowTemplateSpec,
  CashFlowTemplateQuery,
  CashFlowTemplate,
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
    collection(db, USERS, uid || "", CASH_FLOW_TEMPLATES),
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
    id: d.id,
    createdAt: d.get("createdAt"),
    updatedAt: d.get("updatedAt"),
  }))
}

export const saveCashFlowTemplate = async (
  template: SaveCashFlowTemplateSpec
) => {
  const user = getLoggedInUser()
  if (!user) {
    console.log("Cannot save cash flow template with user", { user })
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
