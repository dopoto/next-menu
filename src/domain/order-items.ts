export const ORDER_ONLY_STATUSES = ['draft', 'ordered', 'delivered', 'paid'] as const;
export const PREPAID_STATUSES = ['draft', 'paid'] as const;

export const ORDER_ITEM_STATUSES = [...new Set([...ORDER_ONLY_STATUSES, ...PREPAID_STATUSES])] as const;

type PostpaidOrderItemStatus = (typeof ORDER_ONLY_STATUSES)[number];
type PrepaidOrderItemStatus = (typeof PREPAID_STATUSES)[number];

export type OrderItemStatus = PostpaidOrderItemStatus | PrepaidOrderItemStatus;
