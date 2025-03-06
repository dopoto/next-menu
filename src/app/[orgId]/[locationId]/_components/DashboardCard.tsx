import { Card  } from "~/components/ui/card";

export function DashboardCard(props: {
  title: string;
  value: string;
  secondaryValue: string;
}) {
  return (
    <Card className="p-4 w-[200px] gap-2">
      <p className="text-xs tracking-tight text-pop uppercase font-semibold">{props.title}</p>
      <p className=" text-xl leading-8 font-bold tracking-tight text-gray-600 sm:text-4xl dark:text-white">{props.value}</p>
      <p className="heading-secondary">{props.secondaryValue}</p>
    </Card>
  );
}
