import { get } from "@vercel/edge-config";

export default async function DebugPage() {
  const greeting = await get("greeting");
  return <>edge-config: {greeting}</>;
}
