'use client';

import { Check, Clock } from 'lucide-react';
import { useState } from 'react';
import { Button } from '~/components/ui/button';
import { Card } from '~/components/ui/card';
import { type LocationId } from '~/domain/locations';
import { type OrderWithItems } from '~/domain/orders';
import { updateOrderItemStatus } from '../_actions/updateOrderItemStatus';

export function OrderCard({ order, locationId }: { order: OrderWithItems; locationId: LocationId }) {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdateStatus = async (itemId: number, newStatus: 'ordered' | 'delivered') => {
        try {
            setIsUpdating(true);
            await updateOrderItemStatus(locationId, order.orderId!, itemId, newStatus);
        } catch (error) {
            console.error('Failed to update order status:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card className="p-6">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold">Order #{order.orderId}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
            </div>

            <div className="space-y-4">
                {order.items.map((item, index) => (
                    <div
                        key={`${order.orderId}-${item.menuItem.id}-${index}`}
                        className="flex items-center justify-between border-b pb-2"
                    >
                        <div>
                            <p className="font-medium">{item.menuItem.name}</p>
                            <p className="text-sm text-gray-500">${item.menuItem.price}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {item.status === 'ordered' && (
                                <>
                                    <Clock className="h-4 w-4 text-yellow-500" />
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={isUpdating}
                                        onClick={() => handleUpdateStatus(item.menuItem.id, 'delivered')}
                                    >
                                        Mark Delivered
                                    </Button>
                                </>
                            )}
                            {item.status === 'delivered' && <Check className="h-5 w-5 text-green-500" />}
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}
