import { ChartPie } from "lucide-react";
import { EmptyState } from "~/app/u/[locationId]/_components/EmptyState";

export async function Reports() {
  const items = await Promise.resolve([]);

  if (items.length === 0) {
    const title = "No reports found for this location";
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
