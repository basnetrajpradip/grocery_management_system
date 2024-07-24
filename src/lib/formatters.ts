import * as crypto from "crypto";

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "NPR",
  maximumFractionDigits: 2,
});

const NUMBER_FORMATTER = new Intl.NumberFormat("en-IN");

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount);
}

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number);
}

//format filepath such as products/d4524eaf-7da0-4b14-9c55-cbf60b6b84f4-person.sql to return filename i.e person.sql
export function formatFilename(filePath: string) {
  const lastHyphenIndex = filePath.lastIndexOf("-");

  if (lastHyphenIndex !== -1) {
    return filePath.substring(lastHyphenIndex + 1);
  }

  return filePath;
}
