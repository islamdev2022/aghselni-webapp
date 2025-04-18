export const ACCESS_TOKEN = "access";
export const REFRESH_TOKEN = "refresh"

// This file contains sample card data for demonstration purposes

export interface CardData {
    number: string
    name: string
    expiry: string
    cvv: string
    type: "visa" | "mastercard" | "amex"
    valid: boolean
  }
  
  // Sample valid cards for testing
  export const VALID_CARDS: CardData[] = [
    {
      number: "4111111111111111",
      name: "Test User",
      expiry: "12/25",
      cvv: "123",
      type: "visa",
      valid: true,
    },
    {
      number: "5555555555554444",
      name: "Test User",
      expiry: "10/24",
      cvv: "321",
      type: "mastercard",
      valid: true,
    },
    {
      number: "378282246310005",
      name: "Test User",
      expiry: "06/26",
      cvv: "456",
      type: "amex",
      valid: true,
    },
  ]
  
  // Sample invalid cards for testing
  export const INVALID_CARDS: CardData[] = [
    {
      number: "4242424242424241",
      name: "Invalid User",
      expiry: "01/23",
      cvv: "123",
      type: "visa",
      valid: false,
    },
    {
      number: "5105105105105100",
      name: "Invalid User",
      expiry: "02/22",
      cvv: "321",
      type: "mastercard",
      valid: false,
    },
  ]
  