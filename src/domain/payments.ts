// import { type MenuItem } from '~/domain/menu-items';

// export interface PaymentIntent {
//     id: string;
//     amount: number;
//     currency: string;
//     status: PaymentStatus;
//     clientSecret: string;
//     metadata?: {
//         menuItemId?: string;
//         menuItemName?: string;
//         type?: MenuItem['type'];
//     };
// }

// export type PaymentStatus =
//     | 'requires_payment_method' // Initial status
//     | 'requires_confirmation' // After payment method attached
//     | 'requires_action' // 3D Secure required
//     | 'processing' // Payment is being processed
//     | 'requires_capture' // For authorize-only flows
//     | 'succeeded' // Payment completed successfully
//     | 'failed'; // Payment failed

// // Response when creating a payment intent
// export interface PaymentIntentResponse {
//     clientSecret: string;
//     paymentIntentId: string;
//     merchantStripeAccountId: string;
// }

// export interface PaymentErrorResponse {
//     code: string;
//     message: string;
//     paymentIntentId?: string;
// }

// export interface PaymentButtonProps {
//     clientSecret: string;
//     merchantName: string;
//     amount: number;
//     onSuccess: () => void;
//     onError: (error: Error) => void;
// }

// // Webhook event types we handle
// export type PaymentWebhookEvent =
//     | 'payment_intent.succeeded'
//     | 'payment_intent.payment_failed'
//     | 'charge.refunded'
//     | 'payment_intent.requires_action';

// // Payment transfer details
// export interface PaymentTransfer {
//     id: string;
//     amount: number;
//     currency: string;
//     destinationAccountId: string;
//     paymentIntentId: string;
//     metadata?: Record<string, string>;
// }

// // Payment refund details
// export interface PaymentRefund {
//     id: string;
//     amount: number;
//     currency: string;
//     paymentIntentId: string;
//     reason?: string;
//     status: 'succeeded' | 'failed' | 'pending';
// }
