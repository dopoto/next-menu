'use client';

import type { InferSelectModel } from 'drizzle-orm';
import { BanIcon, CircleCheckIcon, ClockIcon } from 'lucide-react';
import { useState } from 'react';
import {
    ThreeStateToggle,
    type ThreeStateToggleMetadata,
    type ThreeStateToggleSelectedItem,
} from '~/components/ThreeStateToggle';
import { Card } from '~/components/ui/card';
import { type LocationId } from '~/domain/locations';
import { type DeliveryStatusId, type OrderItemId } from '~/domain/order-items';
import { type PublicOrderWithItems } from '~/domain/orders';
import { updateOrderItemDeliveryStatusAction } from '../../../../actions/updateOrderItemDeliveryStatusAction';

const ITEM_STATE: Record<DeliveryStatusId, ThreeStateToggleSelectedItem> = {
    canceled: 0,
    pending: 1,
    delivered: 2,
};

export function OrderCard({
    order,
    locationId,
    menuItemsMap,
}: {
    order: PublicOrderWithItems;
    locationId: LocationId;
    menuItemsMap: Map<number, InferSelectModel<typeof menuItems>>;
}) {
    const [itemIdBeingUpdated, setItemIdBeingUpdated] = useState<OrderItemId | null>(null);

    async function handleItemStateChange(state: ThreeStateToggleSelectedItem, orderItemId: OrderItemId) {
        //TODO refactor, simplify
        const status = Object.keys(ITEM_STATE).find((key) => ITEM_STATE[key as DeliveryStatusId] === state) as
            | DeliveryStatusId
            | undefined;

        if (!status) return;

        try {
            setItemIdBeingUpdated(orderItemId);
            await updateOrderItemDeliveryStatusAction(locationId, orderItemId, status);
        } catch (error) {
            //TODO proper error handling
            alert(`Failed to update order item\n${error?.toString()}`);
        } finally {
            setItemIdBeingUpdated(null);
        }
    }

    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Order #{order.id}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
            </div>
            <div className="space-y-4">
                {order.items.map((item) => {
                    const itemState: ThreeStateToggleSelectedItem = ITEM_STATE[item.orderItem.deliveryStatus!];

                    const left: ThreeStateToggleMetadata = {
                        id: 0,
                        className:
                            itemIdBeingUpdated === item.orderItem.id ? 'animate-spin text-gray-400' : 'text-gray-600',
                        labelWhenSelected: 'Marked as cancelled',
                        labelWhenNotSelected: 'Mark as cancelled',
                        component: <BanIcon />,
                    };
                    const center: ThreeStateToggleMetadata = {
                        id: 1,
                        className:
                            itemIdBeingUpdated === item.orderItem.id ? 'animate-spin text-gray-400' : 'text-orange-500',
                        labelWhenSelected: 'Marked as in preparation',
                        labelWhenNotSelected: 'Mark as in preparation',
                        component: <ClockIcon />,
                    };
                    const right: ThreeStateToggleMetadata = {
                        id: 2,
                        className:
                            itemIdBeingUpdated === item.orderItem.id ? 'animate-spin text-gray-400' : 'text-green-600',
                        labelWhenSelected: 'Marked as delivered',
                        labelWhenNotSelected: 'Mark as delivered',
                        component: <CircleCheckIcon />,
                    };

                    return (
                        <div key={item.orderItem.id} className="flex items-center justify-between border-b pb-2">
                            <div>
                                <p className="font-medium">
                                    {menuItemsMap.get(item.menuItemId)?.name ?? 'Unknown Item'}
                                </p>
                                <p className="text-sm text-gray-500">
                                    ${menuItemsMap.get(item.menuItemId)?.price ?? 'Unknown Item'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <ThreeStateToggle
                                    left={left}
                                    center={center}
                                    right={right}
                                    defaultState={itemState}
                                    onStateChange={(state) => handleItemStateChange(state, item.orderItem.id!)}
                                    size={44}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
