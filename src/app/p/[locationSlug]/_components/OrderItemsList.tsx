import { PublicOrderItem } from '~/app/p/[locationSlug]/_state/cart';

export function OrderItemsList(props: { items: PublicOrderItem[] }) {
    return (
        <>
            {props.items?.map((item, index) => {
                return (
                    <div key={index} className="flex w-full flex-row items-center pt-2 pb-2 text-sm gap-2">
                        <div className="flex flex-col">
                            <div className="">1 x {item.menuItem.name}</div>
                            <div>
                                {item.menuItem.price}
                                {/* TODO{currency.symbol} */}
                            </div>
                        </div>
                    </div>
                );
            })}
        </>
    );
}

// TODO key
