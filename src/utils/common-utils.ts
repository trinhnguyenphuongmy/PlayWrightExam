import { Product } from "../data/objects/Product";

export async function pickRandomIndex(maxIndex: number): Promise<number> {
  return Math.floor(Math.random() * maxIndex);
}

export async function formatCurrency(value: string | number): Promise<string> {
  const number = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(number)) {
    throw new Error(`Invalid number input: ${value}`);
  }

  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export async function getCurrentDate(): Promise<string> {
  const today = new Date();

  const formattedDate = `${today.toLocaleDateString("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "long",
    day: "numeric",
  })}`;

  return formattedDate;
}

export async function generateRandomEmail(
  domain = "example.com"
): Promise<string> {
  //const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8); // random 6 characters
  return `user_${randomStr}@${domain}`;
}

export async function generateRandomPassword(length = 9): Promise<string> {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function getUsernameFromEmail(email: string): Promise<string> {
  if (!email.includes("@")) {
    throw new Error("Invalid email address");
  }
  return email.split("@")[0];
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getTotalPriceOfProducts(products: Product[]): number {
  return products.reduce((total, product) => {
    const price = Number(product.getUnitPrice()); // unit price (string → number)
    const quantity = product.getQuantity();

    return total + price * quantity;
  }, 0);
}
