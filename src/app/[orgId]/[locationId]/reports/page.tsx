import Link from "next/link";
import { locationIdSchema } from "~/app/_domain/location";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

type Params = Promise<{ locationId: string }>;

 export default async function ReportsPage(props: { params: Params }) {
  const params = await props.params;
  throw new Error("d2d")
  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    // TODO new error component
    return 
    //return <BoxError errorTypeId={"MENUS_INVALID_PARAM"} />;
  }

  //TODO replace with actual functionality 

  //const parsedLocationId = validationResult.data;
  //const items = await getMenusByLocation(parsedLocationId);

//   if (items.length === 0) {
//     return (
//       <EmptyState
//         title={"No data to display for this location"}
//         secondary={"To get things going, start by adding one or more menus."}
//         cta={"Add menu"}
//         ctaHref={"menus/add"}
//       />
//     );
//   }

  return (
    <Tabs defaultValue="reports" className="w-[200px]">
    <TabsList className="grid w-full grid-cols-2   h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
      <TabsTrigger value="live"><Link href={`live`}>Live</Link></TabsTrigger>
      <TabsTrigger value="reports">Reports</TabsTrigger>
    </TabsList>
 
    <TabsContent value="reports">
      Reports
    </TabsContent>
  </Tabs>
    // <div>
    //   <div className="flex flex-row gap-2 w-full ">
    //     <DashboardCard title={"Menus"} value={"0"} secondaryValue={""}/>
    //     <DashboardCard title={"Orders"} value={"0"} secondaryValue={""}/>
    //   </div>
    // </div>
  );
}
