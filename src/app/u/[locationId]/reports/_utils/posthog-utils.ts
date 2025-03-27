import { env } from "process";
import { AnalyticsEventId } from "~/domain/analytics";

export async function getViews(orgId: string) {
  const eventName: AnalyticsEventId = "publicLocationVisit";
  const url = `${env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/${env.POSTHOG_PROJECT_ID}/query/`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.POSTHOG_ANALYTICS_QUERIES_API_KEY}`,
  };
  const payload = {
    query: {
      kind: "HogQLQuery",
      query: `
          SELECT
            COUNT(*) AS visit_count
          FROM
            events
          WHERE
            event = '${eventName}' AND properties.orgId = '${orgId}'
            `,
    },
  };
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data = await response.json();
  //await new Promise((resolve) => setTimeout(resolve, 3000));
  const views = data.results[0];
  return views;
}
