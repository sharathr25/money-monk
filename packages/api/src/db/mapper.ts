import { Timestamp } from "firebase/firestore"

export const toDate = (timestamp: Timestamp) =>
  new Date(timestamp.seconds * 1000)
