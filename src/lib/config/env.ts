export type DataMode = "mock" | "amplify" | "localstack";

function getDataMode(): DataMode {
  const mode = process.env.NEXT_PUBLIC_DATA_MODE ?? "mock";
  if (mode === "amplify" || mode === "localstack" || mode === "mock") {
    return mode;
  }
  return "mock";
}

export const env = {
  dataMode: getDataMode(),
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  awsRegion: process.env.AWS_DEFAULT_REGION ?? "us-east-1",
  awsEndpoint:
    process.env.AWS_ENDPOINT_URL ??
    process.env.NEXT_PUBLIC_AWS_ENDPOINT_URL ??
    "http://localhost:4566",
  devAuthBypass:
    process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true" &&
    getDataMode() === "mock",
} as const;
