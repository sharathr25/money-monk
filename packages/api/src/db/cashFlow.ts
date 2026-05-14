import type {
  CashFlow,
  CashFlowProjection,
} from "@workspace/core/type/cashFlow"
import { getMonthRanges } from "@workspace/ui/lib/utils"
import { getLoggedInUser } from "../auth"
import { queryCashFlowTemplates } from "./cashFlowTemplates"
import { getUserData } from "./users"
import dayjs from "dayjs"
import { type Type } from "@workspace/core/type/cashFlowTemplates"

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
    throw new Error("User not found")
  }

  const userData = await getUserData()
  const templates = await queryCashFlowTemplates({ startDate, endDate })

  const income = templates.filter((t) => t.type === "INCOME")
  const expenses = templates.filter((t) => t.type === "EXPENSE")

  const totalIncome = income.reduce((acc, cur) => acc + cur.amount, 0)
  const totalExpenses = expenses.reduce((acc, cur) => acc + cur.amount, 0)

  const openingBalance = userData.openingBalance
  const netCashFlow = getNetCashFlow(totalIncome, totalExpenses)
  const closingBalance = getClosingBalance(openingBalance, netCashFlow)

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

export const getNetCashFlow = (totalIncome: number, totalExpenses: number) =>
  totalIncome - totalExpenses

export const getClosingBalance = (
  openingBalance: number,
  netCashFlow: number
) => openingBalance + netCashFlow

export const getCashFlowProjection = async (
  months: number = 6
): Promise<CashFlowProjection[]> => {
  const user = getLoggedInUser()
  if (!user) {
    console.log("Cannot save cash flow template without user")
    throw new Error("User not found")
  }

  const monthFormat = "MMMM"
  const monthRanges = getMonthRanges(months, monthFormat)
  const monthlyAmountsMap: Record<string, number> = monthRanges.reduce(
    (acc, cur) => ({ ...acc, [cur.month]: 0 }),
    {}
  )
  const monthlyAmountsSum: Record<Type, Record<string, number>> = {
    EXPENSE: { ...monthlyAmountsMap },
    INCOME: { ...monthlyAmountsMap },
  }
  const recurringAmountsSum: Record<Type, number> = { EXPENSE: 0, INCOME: 0 }

  const templates = await queryCashFlowTemplates({
    startDate: monthRanges[0].startDate,
    endDate: monthRanges[monthRanges.length - 1].endDate,
  })

  templates.forEach((t) => {
    if (t.date) {
      const month = dayjs(t.date).format(monthFormat)
      monthlyAmountsSum[t.type][month] += t.amount
    } else {
      recurringAmountsSum[t.type] += t.amount
    }
  })

  const userData = await getUserData()

  let openingBalance = userData.openingBalance

  return monthRanges.map((m) => {
    const totalIncome =
      recurringAmountsSum.INCOME + monthlyAmountsSum["INCOME"][m.month]
    const totalExpenses =
      recurringAmountsSum.EXPENSE + monthlyAmountsSum["EXPENSE"][m.month]
    const netCashFlow = getNetCashFlow(totalIncome, totalExpenses)
    const closingBalance = getClosingBalance(openingBalance, netCashFlow)

    const projection = {
      ...m,
      totalIncome,
      totalExpenses,
      netCashFlow,
      closingBalance,
      openingBalance,
    }

    openingBalance = closingBalance

    return projection
  })
}
