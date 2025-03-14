// import { Fragment, type ReactNode } from "react";
// import { Badge } from "~/components/ui/badge";

// type Section = {
//   title: string;
//   content: ReactNode | string;
// };

// export function PreviewCard(props: { title: string; sections: Section[] }) {
//   return (
//     <div className="mb-4 flex flex-col rounded-xl border-1 border-dashed border-gray-300 bg-gray-50/20 p-4 text-xs">
//       <div className="text-center text-sm text-gray-500 uppercase">
//         {props.title}
//       </div>
//       {props.sections.map((section) => (
//         <Fragment key={section.title}>
//           <Badge
//             variant={"outline"}
//             className="mt-5 mr-1 mb-1 w-[70px] gap-0 border-dashed border-gray-400"
//           >
//             {section.title}
//           </Badge>
//           <div className="max-w-md">{section.content}</div>
//         </Fragment>
//       ))}
//     </div>
//   );
// }
