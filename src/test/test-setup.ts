jest.mock("@t3-oss/env-nextjs", () => ({
  createEnv: jest.fn(() => ({
    NODE_ENV: "test",
    OTHER_VAR: "value",
  })),
}));
