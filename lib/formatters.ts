/**
 * Formats a credit card number with spaces every 4 digits
 */
export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "")
  const groups = []

  for (let i = 0; i < digits.length; i += 4) {
    groups.push(digits.slice(i, i + 4))
  }

  return groups.join(" ")
}

/**
 * Formats an expiry date as MM/YY
 */
export function formatExpiryDate(value: string): string {
  const digits = value.replace(/\D/g, "")

  if (digits.length <= 2) {
    return digits
  }

  const month = digits.slice(0, 2)
  const year = digits.slice(2, 4)

  return `${month}/${year}`
}

/**
 * Checks if a card is expiring within the next 3 months
 */
export function isExpiringSoon(expiryDate: string): boolean {
  const [month, year] = expiryDate.split("/")

  if (!month || !year) return false

  // Convert to full year (assuming 20xx)
  const fullYear = 2000 + Number.parseInt(year)

  // Create date objects
  const expiryDateObj = new Date(fullYear, Number.parseInt(month) - 1)
  const today = new Date()
  const threeMonthsFromNow = new Date()
  threeMonthsFromNow.setMonth(today.getMonth() + 3)

  // Card is expiring soon if it expires within the next 3 months
  return expiryDateObj <= threeMonthsFromNow && expiryDateObj >= today
}
