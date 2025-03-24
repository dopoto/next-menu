import { redirect } from "next/navigation";
import { ROUTES } from "~/app/_domain/routes";

export default async function Page() {
  redirect(ROUTES.my);
}
