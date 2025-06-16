'use client';

import type { InferSelectModel } from 'drizzle-orm';
import { BanIcon, ChevronsDownIcon, ChevronsUpIcon, CircleCheckIcon, ClockIcon, EllipsisVerticalIcon, SoupIcon, SquareArrowDownIcon, WineIcon } from 'lucide-react';
import { useState } from 'react';
import { updateOrderItemDeliveryStatusAction } from '~/app/actions/updateOrderItemDeliveryStatusAction';
import { CompletedOrderWithItems } from '~/app/u/[locationId]/orders/completed/_components/CompletedOrdersList';
import {
    ThreeStateToggle,
    type ThreeStateToggleMetadata,
    type ThreeStateToggleSelectedItem,
} from '~/components/ThreeStateToggle';
import { Card } from '~/components/ui/card';
import { type LocationId } from '~/domain/locations';
import { type DeliveryStatusId, type OrderItemId } from '~/domain/order-items';
import { type menuItems } from '~/server/db/schema';
import { MenuItemImage } from '~/components/MenuItemImage';

const ITEM_STATE: Record<DeliveryStatusId, ThreeStateToggleSelectedItem> = {
    canceled: 0,
    pending: 1,
    delivered: 2,
};

export function CompletedOrderCard({
    order,
    locationId,
    menuItemsMap,
    overlayComponent,
    onToggleExpanded,
    onItemStatusChanged
}: {
    order: CompletedOrderWithItems;
    locationId: LocationId;
    menuItemsMap: Map<number, InferSelectModel<typeof menuItems>>;
    overlayComponent: React.ReactNode,
    onToggleExpanded: () => void
    onItemStatusChanged: () => void
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
            onItemStatusChanged();
        }
    }

    const formattedDate = order.createdAt.toLocaleString('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    return (
        <div className="relative">
            <Card className={`p-2 relative`}>
                <div className="flex justify-between items-start cursor-pointer" onClick={onToggleExpanded}>
                    <div className="flex-1">
                        <div className="flex items-center gap-1" >
                            <button className="cursor-pointer" >{order.isExpanded ? <ChevronsUpIcon size={16} /> : <ChevronsDownIcon size={16} />}</button>
                            <h4 className="text-base font-semibold mr-2">Order #{order.id}</h4>
                        </div>
                        <p className="text-sm text-gray-500">{formattedDate}</p>
                    </div>
                    {/* <div className="w-[24px] h-[24px] py-2"><EllipsisVerticalIcon /></div> */}
                </div>
                {order.isExpanded && <div className="space-y-4">
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

                        const { imageId } = menuItemsMap.get(item.menuItemId) ?? { id: null, name: 'Unknown Item' };

                        return (
                            <div key={item.orderItem.id} className="flex  justify-between   gap-2">
                                <MenuItemImage imageId={imageId} sizeInPx={40} />
                                <div className="flex-1">
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
                </div>}
                {overlayComponent}
            </Card>
        </div>
    );
}
