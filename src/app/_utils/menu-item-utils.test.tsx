import "@testing-library/jest-dom";

import { AppError } from "~/lib/error-utils.server";
import { getValidMenuItemIdOrThrow } from "~/lib/menu-items";

describe("getValidMenuItemIdOrThrow", () => {
  it("should return the parsed menu item ID when given a valid string number", () => {
    const result = getValidMenuItemIdOrThrow("123");
    expect(result).toBe(123);
  });

  it("should throw AppError when given undefined", () => {
    expect(() => getValidMenuItemIdOrThrow(undefined)).toThrow(AppError);
  });

  it("should throw AppError when given an empty string", () => {
    expect(() => getValidMenuItemIdOrThrow("")).toThrow(AppError);
  });

  it("should throw AppError when given a non-numeric string", () => {
    expect(() => getValidMenuItemIdOrThrow("abc")).toThrow(AppError);
  });

  it("should throw AppError when given zero", () => {
    expect(() => getValidMenuItemIdOrThrow("0")).toThrow(AppError);
  });

  it("should throw AppError when given a negative number", () => {
    expect(() => getValidMenuItemIdOrThrow("-1")).toThrow(AppError);
  });

  it("should throw AppError when given a decimal number", () => {
    expect(() => getValidMenuItemIdOrThrow("1.5")).toThrow(AppError);
  });
});
