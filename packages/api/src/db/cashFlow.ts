import type {
  CashFlow,
  CashFlowProjection,
} from "@workspace/core/type/cashFlow"
import { getMonthRanges } from "@workspace/ui/lib/utils"
import { getUserData } from "./users"
import dayjs from "dayjs"
import { queryTransactions } from "./transactions"
import type { TransactionType } from "@workspace/core/type/transactions"

export const getCashFlow =
  (uid: string) =>
  async ({
    startDate,
    endDate,
  }: {
    startDate: Date
    endDate: Date
  }): Promise<CashFlow> => {
    const userData = await getUserData(uid)
    const plannedTransactions = await queryTransactions(uid)({
      plannedStartDate: startDate,
      plannedEndDate: endDate,
      plannedDateExists: true,
    })

    const income = plannedTransactions.filter((t) => t.type === "INCOME")
    const expenses = plannedTransactions.filter((t) => t.type === "EXPENSE")

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

export const getCashFlowProjection =
  (uid: string) =>
  async (months: number = 6): Promise<CashFlowProjection[]> => {
    const monthFormat = "MMMM"
    const monthRanges = getMonthRanges(months, monthFormat)
    const monthlyAmountsMap: Record<string, number> = monthRanges.reduce(
      (acc, cur) => ({ ...acc, [cur.month]: 0 }),
      {}
    )
    const monthlyAmountsSum: Record<TransactionType, Record<string, number>> = {
      EXPENSE: { ...monthlyAmountsMap },
      INCOME: { ...monthlyAmountsMap },
      ADJUSTMENT: { ...monthlyAmountsMap },
      SAVINGS: { ...monthlyAmountsMap },
    }
    const recurringAmountsSum: Record<TransactionType, number> = {
      EXPENSE: 0,
      INCOME: 0,
      ADJUSTMENT: 0,
      SAVINGS: 0,
    }

    const templates = await queryTransactions(uid)({
      plannedStartDate: monthRanges[0].startDate,
      plannedEndDate: monthRanges[monthRanges.length - 1].endDate,
      plannedDateExists: true,
    })

    templates.forEach((t) => {
      if (t.frequency === "ONE_TIME") {
        const month = dayjs(t.plannedDate).format(monthFormat)
        monthlyAmountsSum[t.type][month] += t.amount
      } else {
        recurringAmountsSum[t.type] += t.amount
      }
    })

    const userData = await getUserData(uid)

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
