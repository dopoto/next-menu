export const PREPAID_STATUSES = ['draft', 'paid'] as const;
export const POSTPAID_STATUSES = ['draft', 'ordered', 'delivered', 'paid'] as const;
export const ORDER_ITEM_STATUSES = [...new Set([...POSTPAID_STATUSES, ...PREPAID_STATUSES])] as const;

type PostpaidOrderItemStatus = (typeof POSTPAID_STATUSES)[number];
type PrepaidOrderItemStatus = (typeof PREPAID_STATUSES)[number];

export type OrderItemStatus = PostpaidOrderItemStatus | PrepaidOrderItemStatus;
