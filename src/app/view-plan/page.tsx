import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { OverviewCard } from "../_components/OverviewCard";
import { SplitScreenContainer } from "../_components/SplitScreenContainer";

export default function ChangePlanPage() {
  return (
    <SplitScreenContainer
      mainComponent={<PlanOverview />}
      title={"Your plan"}
      subtitle={"Please select a new plan below"}
    ></SplitScreenContainer>
  );
}

function PlanOverview() {
  return (
    <>
      <OverviewCard
        title={"Plan usage"}
        sections={[
          { title: "", content: <PlanUsage /> },
        ]}
        variant="neutral"
      />
      <OverviewCard
        title={"Plan usage"}
        sections={[
          { title: "", content: <PlanBilling /> },
        ]}
        variant="neutral"
      />
    </>
  );
}

function PlanUsage() {
  return (
    <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}

function PlanBilling() {
  return (
    <Table>
      <TableCaption>A list of your billing!!</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Invoice</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Method</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell className="font-medium">INV001</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>Credit Card</TableCell>
          <TableCell className="text-right">$250.00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
