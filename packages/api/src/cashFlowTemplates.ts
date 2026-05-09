import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "./firebase"
import { CASH_FLOW_TEMPLATES } from "./collections"
import { CashFlowTemplateQuery } from "@workspace/core/type/cashFlowTemplates"

export const getCashFlowTemplates = async ({
  uid,
  type,
}: CashFlowTemplateQuery) => {
  const q = query(
    collection(db, CASH_FLOW_TEMPLATES),
    where("userId", "==", uid),
    where("type", "==", "INCOME")
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((d) => ({ ...d.data(), id: d.id }))
}
