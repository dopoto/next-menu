import { z } from "zod";
import { ReactNode } from "react";
import * as React from "react";
import { ROUTES } from "~/app/_domain/routes";

export const ReportIdSchema = z.union([
  z.literal("publicLocationViews"),
  z.literal("publicLocationViews2w"),
]);

export type ReportId = z.infer<typeof ReportIdSchema>;

export type ReportConfig = {
  title: string;
  footer: string | ReactNode;
};

export const REPORTS: Record<ReportId, ReportConfig> = {
  publicLocationViews: {
    title: "Total views",
    footer: (
      <div className="text-muted-foreground">
        Visitors of your{" "}
        {/* <a className="blue-link" href={ROUTES.location(props.locationId)}>
          public location page
        </a> */}
        <a className="blue-link" href="TODO">
          public location page
        </a>
      </div>
    ),
  },
  publicLocationViews2w: {
    title: "",
    footer: undefined,
  },
};
