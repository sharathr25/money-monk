import { collection, getDocs } from "firebase/firestore"
import { db } from "./firebase"
import { CASH_FLOW_TEMPLATES } from "./collections"

export const getCashFlowTemplates = async () => {
  const querySnapshot = await getDocs(collection(db, CASH_FLOW_TEMPLATES))
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`)
  })
}
