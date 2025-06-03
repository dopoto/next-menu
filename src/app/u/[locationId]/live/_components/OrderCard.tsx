'use client';

import type { InferSelectModel } from 'drizzle-orm';
import { BanIcon, CircleCheckIcon, ClockIcon } from 'lucide-react';
import { useState } from 'react';
import { ThreeStateToggle, ThreeStateToggleSelectedItem } from '~/components/ThreeStateToggle';
import { Card } from '~/components/ui/card';
import { type LocationId } from '~/domain/locations';
import { type PublicOrderWithItems } from '~/domain/orders';
import { type menuItems } from '~/server/db/schema';
import { updateOrderItemDeliveryStatusAction } from '../../../../actions/updateOrderItemDeliveryStatusAction';
import { DeliveryStatusId } from '~/domain/order-items';

const ITEM_STATE: Record<DeliveryStatusId, ThreeStateToggleSelectedItem> = {
    'canceled': 0,
    'pending': 1,
    'delivered': 2,
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
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleItemStateChange(state: ThreeStateToggleSelectedItem, itemId: number) {

        const status = Object.keys(ITEM_STATE).find(
            key => ITEM_STATE[key as DeliveryStatusId] === state
        ) as DeliveryStatusId | undefined;

        if (!status) return;

        try {
            setIsUpdating(true);
            await updateOrderItemDeliveryStatusAction(locationId, itemId, status);
        } catch (error) {
            console.error('Failed to mark as pending:', error);
        } finally {
            setIsUpdating(false);
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
                {order.items.map((item, index) => {
                    const itemState: ThreeStateToggleSelectedItem = ITEM_STATE[item.orderItem.deliveryStatus as DeliveryStatusId] || 1;
                    return (
                        <div
                            key={`${order.id}-${item.menuItemId}-${index}`}
                            className="flex items-center justify-between border-b pb-2"
                        >
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
                                    defaultState={itemState}
                                    onStateChange={(state) => handleItemStateChange(state, item.orderItem.id!)}
                                    size={44}
                                    leftIcon={<BanIcon />}
                                    centerIcon={<ClockIcon />}
                                    rightIcon={<CircleCheckIcon />}
                                />
                                {/* {item.orderItem.isDelivered === false && (
                                    <>
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={isUpdating}
                                            onClick={() => markAsDelivered(item.orderItem.id!)}
                                        >
                                            Mark Delivered
                                        </Button>
                                    </>
                                )} */}
                                {/* {item.orderItem.isDelivered && <Check className="h-5 w-5 text-green-500" />} */}
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}
