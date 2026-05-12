import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const AMOUNT_FORMATER_WITH_CURRENCY = new Intl.NumberFormat("en-IN", {
  currency: "INR",
  style: "currency",
})

const AMOUNT_FORMATER = new Intl.NumberFormat("en-IN", {
  currency: "INR",
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const removeCommas = (str: string) =>
  str.replace(/\D/g, "").replace("₹", "")

export function formatAmount(amount: string, withCurrency: boolean = true) {
  const amountWithoutCommas = removeCommas(amount)
  const formater = withCurrency
    ? AMOUNT_FORMATER_WITH_CURRENCY
    : AMOUNT_FORMATER
  return amountWithoutCommas && formater.format(parseFloat(amountWithoutCommas))
}

export const amountToDouble = (amount: string) =>
  parseFloat(amount.replace(/\D/g, ""))
