// type OrderOnlyOrderItemStatus = 'draft' | 'ordered' | 'delivered' | 'paid';
// type PrepaidOrderItemStatus = 'draft' | 'paid';

// export type OrderItemStatus = OrderOnlyOrderItemStatus | PrepaidOrderItemStatus;

export const ORDER_ONLY_STATUSES = ['draft', 'ordered', 'delivered', 'paid'] as const;
export const PREPAID_STATUSES = ['draft', 'paid'] as const;

export const ORDER_ITEM_STATUSES = [...new Set([...ORDER_ONLY_STATUSES, ...PREPAID_STATUSES])] as const;

type OrderOnlyOrderItemStatus = (typeof ORDER_ONLY_STATUSES)[number];
type PrepaidOrderItemStatus = (typeof PREPAID_STATUSES)[number];

export type OrderItemStatus = OrderOnlyOrderItemStatus | PrepaidOrderItemStatus;
