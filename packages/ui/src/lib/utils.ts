import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"
import type { Type } from "@workspace/core/type/cashFlowTemplates"

const numberFormatOptions = {
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}
const AMOUNT_FORMATER_WITH_CURRENCY = new Intl.NumberFormat("en-IN", {
  ...numberFormatOptions,
  style: "currency",
})

const AMOUNT_FORMATER = new Intl.NumberFormat("en-IN", numberFormatOptions)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const removeCommas = (str: string) =>
  str.replace(/\D/g, "").replace("₹", "")

export function formatAmount(
  amount: string | number,
  { withCurrency, withSign }: { withCurrency: boolean; withSign: boolean } = {
    withCurrency: true,
    withSign: false,
  }
) {
  const amountWithoutCommas = removeCommas(`${amount}`)
  const formater = withCurrency
    ? AMOUNT_FORMATER_WITH_CURRENCY
    : AMOUNT_FORMATER
  const amountFloated = parseFloat(amountWithoutCommas)
  const isPositive = amountFloated > 0
  return (
    amountWithoutCommas &&
    (withSign ? (isPositive ? "+" : "-") + " " : "") +
      formater.format(amountFloated)
  )
}

export const formatCashFlowAmount = (
  type: Type,
  amount: string | number,
  options?: { withCurrency: boolean; withSign: boolean }
) => `${type === "INCOME" ? "+" : "-"} ${formatAmount(amount, options)}`

export const amountToDouble = (amount: string) =>
  parseFloat(amount.replace(/\D/g, ""))

export const daysOfMonth = (): number[] =>
  new Array(31).fill(null).map((_, i) => i + 1)

export const formatDate = (date: Date) => dayjs(date).format("MMM D, YYYY")

export const formatDateTime = (date: Date) =>
  dayjs(date).format("MMM D, YYYY h:mm A")

export const formatDayOfMonth = (day: number): string => {
  if (day < 1 || day > 31) {
    return `${day}`
  }

  const remainder10 = day % 10
  const remainder100 = day % 100

  if (remainder100 >= 11 && remainder100 <= 13) {
    return `${day}th`
  }

  switch (remainder10) {
    case 1:
      return `${day}st`
    case 2:
      return `${day}nd`
    case 3:
      return `${day}rd`
    default:
      return `${day}th`
  }
}
