import { Suspense } from "react";
import { locationIdSchema } from "~/app/[orgId]/[locationId]/_domain/locations";
import { EmptyState } from "../_components/EmptyState";
import { ChartPie } from "lucide-react";

type Params = Promise<{ locationId: string }>;

 export default async function ReportsPage(props: { params: Params }) {
  const params = await props.params;

  //TODO org checks

  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    throw new Error(`Invalid location: ${params.locationId}`);
  }

    //TODO: Implement OpenOrders page
    const items = await Promise.resolve([]);

    if (items.length === 0) {
 
      const title =   "No reports found for this location";      
      const secondary = "Please come back in a while.";
      return (
        <EmptyState
          icon={<ChartPie size={36} />}
          title={title}
          secondary={secondary}
 
        />
      );
    }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>Reports</div>
    </Suspense>
  );
}
