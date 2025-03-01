import Link from "next/link";
import { Button } from "~/components/ui/button";

export const PostPayment = ({ tierId, stripeSession }: { tierId: string,stripeSession: {id: string} }) => {
  return (
    <div>
      [{tierId}]
      <textarea cols={70} rows={60}>{JSON.stringify(stripeSession, null, 2)}</textarea>
      <Link href={`/onboarding/${tierId}/add-location?session_id=${stripeSession?.id}`}>
        <Button>Add location</Button>
      </Link>
    </div>
  );
};
