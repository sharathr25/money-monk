import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

const AMOUNT_FORMATER = new Intl.NumberFormat("en-IN", { currency: "INR" })
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const removeCommas = (str: string) => str.replace(/\D/g, "")

export function formatAmount(amount: string) {
  const amountWithoutCommas = removeCommas(amount)
  return (
    amountWithoutCommas &&
    AMOUNT_FORMATER.format(parseFloat(amountWithoutCommas))
  )
}

export const amountToDouble = (amount: string) =>
  parseFloat(amount.replace(/\D/g, ""))
