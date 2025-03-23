import { redirect } from "next/navigation";
import { ROUTES } from "../_domain/routes";

export default async function Page() {
  redirect(ROUTES.my);
}
