// import { ConvexHttpClient } from "convex/browser";
// import { api } from '../../../convex/_generated/api';
// import { type z } from 'zod';
// import { type menuFormSchema } from '~/domain/menus';

// const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// /**
//  * Creates a menu in Convex with the given data.
//  * Handles conversion from Drizzle numeric IDs to Convex string IDs.
//  */
// export async function createConvexMenu(data: z.infer<typeof menuFormSchema>) {
//     return await convex.mutation(api.menus.createMenu, {
//         name: data.name,
//         locationId: data.locationId,  // Now expecting numeric ID
//         isPublished: true,
//         items: data.items?.map((item, index) => ({
//             id: item.id,  // Now expecting numeric ID
//             sortOrderIndex: index,
//         })),
//     });
// }
