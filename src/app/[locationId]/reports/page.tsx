import { Suspense } from "react";
import { locationIdSchema } from "../_domain/locations";
import LoadingSection from "../_components/LoadingSection";
import { Reports } from "./_components/Reports";

type Params = Promise<{ locationId: string }>;

 export default async function ReportsPage(props: { params: Params }) {
  const params = await props.params;

  //TODO org checks

  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    throw new Error(`Invalid location: ${params.locationId}`);
  }
 
  return (
    <Suspense fallback={<LoadingSection />}>
      <Reports   />
    </Suspense>
  );
}
