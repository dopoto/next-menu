import Link from "next/link";
import { Button } from "~/components/ui/button";
 
export const Overview = () => {
  return (
    <div className="flex w-full flex-col gap-6">
      {/* TODO Selected plasn, signed upo as, org, pay, location */}
      <div className="flex   flex-col gap-6">
      <Link className="w-full" href={"/my"}>
        <Button className="w-full">Take me to my dashboard</Button>
      </Link>
    </div>
    </div>
  );
};
