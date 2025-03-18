import React from "react";
import { getAppVersion } from "../_utils/app-version-utils";

export function AppVersion() { 
  return (
    <div className="my-auto">
      <i>the</i>
      <span className="text-gray-600 dark:text-gray-400">Menu</span> v
      {getAppVersion()}
    </div>
  );
}
