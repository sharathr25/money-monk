export type UserData = {
  currency: string
  locale: string
  openingBalance: number
  updatedAt: Date
  createdAt: Date
}

export type UserDataUpdateSpec = {
  currency?: string
  locale?: string
  openingBalance?: number
}
