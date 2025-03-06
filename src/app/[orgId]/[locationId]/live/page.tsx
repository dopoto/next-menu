import Link from "next/link";
import { BoxError } from "~/app/_components/BoxError";
import { locationIdSchema } from "~/app/_domain/location";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

 

type Params = Promise<{ locationId: string }>;

 export default async function MenusPage(props: { params: Params }) {
  const params = await props.params;

  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    return <BoxError errorTypeId={"MENUS_INVALID_PARAM"} />;
  }

  //TODO replace with actual functionality 

  const parsedLocationId = validationResult.data;
//   const items = await getMenusByLocation(parsedLocationId);

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
    <Tabs defaultValue="live" className="w-[200px]">
    <TabsList className="grid w-full grid-cols-2   h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground">
      <TabsTrigger value="live">Live</TabsTrigger>
      <TabsTrigger value="reports"><Link href={`reports`}>Reports</Link></TabsTrigger>
    </TabsList>
 
    <TabsContent value="live">
      Live data
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
