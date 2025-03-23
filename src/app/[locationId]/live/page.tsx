import { Suspense } from "react";
import { locationIdSchema } from "../_domain/locations";
import LoadingSection from "../_components/LoadingSection";
import { OpenOrdersList } from "./_components/OpenOrdersList";

type Params = Promise<{ locationId: string }>;

export default async function OpenOrdersPage(props: { params: Params }) {
  const params = await props.params;

  const validationResult = locationIdSchema.safeParse(params.locationId);
  if (!validationResult.success) {
    throw new Error(`Invalid location: ${params.locationId}`);
  }

  return (
    <Suspense fallback={<LoadingSection />}>
      <OpenOrdersList />
    </Suspense>
  );
}
