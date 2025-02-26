import { GeistSans } from "geist/font/sans";

export const buildHtmlClass = (theme?: string) => {
  return `${GeistSans.variable} ${theme}`
}