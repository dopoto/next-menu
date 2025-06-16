// 'use client';

// import { Provider, useSetAtom } from 'jotai';
// import 'jotai-devtools/styles.css';
// import { type ReactNode, useEffect } from 'react';
// import type { DevToolsProps } from 'jotai-devtools';
// import dynamic from 'next/dynamic';
// import type { ComponentType } from 'react';
// import { completedOrdersAtom, menuItemsAtom, openOrdersAtom } from '../_state/atoms';
// import type { MenuItem } from '~/domain/menu-items';
// import type { PublicOrderWithItems } from '~/domain/orders';

// let DevTools: ComponentType<DevToolsProps> | null = null;

// if (process.env.NODE_ENV !== 'production') {
//     DevTools = dynamic(() => import('./JotaiDevTools').then((mod) => ({ default: mod.DevTools })), { ssr: false });
// }

// function Initializer(props: {
//     openOrders: PublicOrderWithItems[];
//     completedOrders: PublicOrderWithItems[];
//     menuItems: MenuItem[];
// }) {
//     const setOpenOrders = useSetAtom(openOrdersAtom);
//     const setCompletedOrders = useSetAtom(completedOrdersAtom);
//     const setMenuItems = useSetAtom(menuItemsAtom);

//     useEffect(() => {
//         setOpenOrders(props.openOrders);
//     }, [props.openOrders, setOpenOrders]);

//     useEffect(() => {
//         setCompletedOrders(props.completedOrders);
//     }, [props.completedOrders, setCompletedOrders]);

//     useEffect(() => {
//         setMenuItems(new Map(props.menuItems.map((item) => [item.id, item])));
//     }, [props.menuItems, setMenuItems]);

//     return null;
// }

// export default function JotaiProviderWrapper(props: {
//     children: ReactNode;
//     openOrders: PublicOrderWithItems[];
//     completedOrders: PublicOrderWithItems[];
//     menuItems: MenuItem[];
// }) {
//     return (
//         <Provider>
//             <Initializer
//                 openOrders={props.openOrders}
//                 completedOrders={props.completedOrders}
//                 menuItems={props.menuItems}
//             />
//             {DevTools && <DevTools />}
//             {props.children}
//         </Provider>
//     );
// }
