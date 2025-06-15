
/// <reference types="vite/client" />

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayCheckoutOptions) => any;
  }

  interface RazorpayCheckoutOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    image?: string;
    handler: (response: any) => void;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, any>;
    theme?: {
      color?: string;
    };
    // You can extend this with more fields from the Razorpay docs as needed
  }
}

export {};
