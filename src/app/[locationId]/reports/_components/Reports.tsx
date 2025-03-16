import { ChartPie } from "lucide-react";
import { EmptyState } from "~/app/[locationId]/_components/EmptyState";
import { type LocationId } from "~/app/[locationId]/_domain/locations";

export async function Reports(_props: { locationId: LocationId }) {
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

  return <div>Reports</div>;
}
