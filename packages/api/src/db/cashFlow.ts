import type { CashFlow } from "@workspace/core/type/cashFlow"
import { getLoggedInUser } from "../auth"
import { queryCashFlowTemplates } from "./cashFlowTemplates"
import { getUserData } from "./users"

export const getCashFlow = async ({
  startDate,
  endDate,
}: {
  startDate: Date
  endDate: Date
}): Promise<CashFlow> => {
  const user = getLoggedInUser()
  if (!user) {
    console.log("Cannot save cash flow template without user")
    throw new Error("User nnot found")
  }

  const userData = await getUserData()
  const templates = await queryCashFlowTemplates({ startDate, endDate })

  const income = templates.filter((t) => t.type === "INCOME")
  const expenses = templates.filter((t) => t.type === "EXPENSE")

  const totalIncome = income.reduce((acc, cur) => acc + cur.amount, 0)
  const totalExpenses = expenses.reduce((acc, cur) => acc + cur.amount, 0)

  const openingBalance = userData.openingBalance
  const netCashFlow = totalIncome - totalExpenses
  const closingBalance = openingBalance + netCashFlow

  return {
    income,
    expenses,
    totalIncome,
    totalExpenses,
    openingBalance,
    netCashFlow,
    closingBalance,
  }
}
