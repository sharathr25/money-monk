import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import dayjs from "dayjs"
import type { Type } from "@workspace/core/type/cashFlowTemplates"

const NUMBER_FORMAT_OPTIONS = {
  currency: "INR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
}

const MONTHS_PER_YEAR = 12

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const removeCommas = (str: string) =>
  str.replace(/,/g, "").replace("₹", "")

export function formatAmount(
  amount: string | number,
  { withCurrency, withSign }: { withCurrency?: boolean; withSign?: boolean } = {
    withCurrency: false,
    withSign: false,
  }
) {
  const opts: Intl.NumberFormatOptions = { ...NUMBER_FORMAT_OPTIONS }
  if (withCurrency) {
    opts.style = "currency"
  }
  if (withSign) {
    opts.signDisplay = "always"
  }

  const amountWithoutCommas = removeCommas(`${amount}`)

  return (
    amountWithoutCommas &&
    new Intl.NumberFormat("en-IN", opts).format(parseFloat(amountWithoutCommas))
  )
}

export const formatCashFlowAmount = (
  type: Type,
  amount: string | number,
  options?: { withCurrency: boolean; withSign: boolean }
) => `${type === "INCOME" ? "+" : "-"} ${formatAmount(amount, options)}`

export const amountToDouble = (amount: string) =>
  parseFloat(removeCommas(amount))

export const daysOfMonth = (): number[] =>
  new Array(31).fill(null).map((_, i) => i + 1)

export const formatDate = (date: Date) => dayjs(date).format("MMM D, YYYY")

export const formatDateTime = (date: Date) =>
  dayjs(date).format("MMM D, YYYY h:mm A")

export const formatDayOfMonth = (day: number): string => {
  if (day < 1 || day > 31) {
    return `${day}`
  }

  if (day > dayjs(new Date()).daysInMonth()) {
    return "Last Day"
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

export function getMonthRanges(months: number, monthFormat: string = "MMMM") {
  return Array.from({ length: months }, (_, index) => {
    const date = dayjs().add(index, "month")

    return {
      month: date.format(monthFormat),
      year: date.format("YYYY"),
      startDate: date.startOf("month").toDate(),
      endDate: date.endOf("month").toDate(),
    }
  })
}

export function isNumber(str: string) {
  return !Number.isNaN(parseInt(str))
}

export function pluralise({
  n,
  str,
  customPluralStr,
}: {
  n: number
  str: string
  customPluralStr?: string
}) {
  if (n === 1) return str
  if (customPluralStr) return customPluralStr
  return str + "s"
}

export const formatDuration = (totalMonths: number) => {
  const years = Math.floor(totalMonths / MONTHS_PER_YEAR)
  const months = totalMonths % MONTHS_PER_YEAR

  return [
    years > 0 && `${years} ${pluralise({ n: years, str: "Year" })}`,
    months > 0 && `${months} ${pluralise({ n: months, str: "Month" })}`,
  ]
    .filter(Boolean)
    .join(" ")
}
