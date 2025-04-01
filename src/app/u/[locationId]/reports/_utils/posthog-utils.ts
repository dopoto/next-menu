import { env } from "process";
import { type AnalyticsEventId } from "~/domain/analytics";
import { generateErrorId, logException } from "~/lib/error-utils.server";

export async function getViews(orgId: string): Promise<number | null> {
  const eventName: AnalyticsEventId = "publicLocationVisit";
  const url = `${env.NEXT_PUBLIC_POSTHOG_HOST}/api/projects/${env.POSTHOG_PROJECT_ID}/query/`;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${env.POSTHOG_ANALYTICS_QUERIES_API_KEY}`,
  };
  const payload = {
    query: {
      kind: "HogQLQuery",
      query: `SELECT COUNT(*) AS visit_count FROM events WHERE event = '${eventName}' AND properties.orgId = '${orgId}' AND timestamp >= parseDateTimeBestEffort('2025-01-01 00:00:00')`,
    },
  };
  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(payload),
  });

  const data: ApiResponse = (await response.json()) as ApiResponse;
  const output = data?.results?.[0]?.[0];
  if (typeof output === "number") {
    return output;
  } else {
    const eventId = generateErrorId();
    logException(
      new Error(`Unexpected Posthog response: ${JSON.stringify(data)}`),
      eventId,
    );
    return null;
  }
}

interface ApiResponse {
  results?: number[][];
}
