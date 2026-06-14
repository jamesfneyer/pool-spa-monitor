import type { DataMode } from "./env";

export type DataProviderKind = "mock" | "amplify";
export type PersistenceKind = "ephemeral" | "dynamodb";

export interface DataModeInfo {
  mode: DataMode;
  provider: DataProviderKind;
  persistence: PersistenceKind;
  description: string;
  /** True when NEXT_PUBLIC_DATA_MODE=localstack but the app uses mock storage. */
  localstackFallback: boolean;
}

export function getDataModeInfo(mode: DataMode): DataModeInfo {
  switch (mode) {
    case "amplify":
      return {
        mode,
        provider: "amplify",
        persistence: "dynamodb",
        description: "Amplify sandbox — DynamoDB via AppSync",
        localstackFallback: false,
      };
    case "localstack":
      return {
        mode,
        provider: "mock",
        persistence: "ephemeral",
        description: "LocalStack provider not implemented; using in-memory mock",
        localstackFallback: true,
      };
    case "mock":
    default:
      return {
        mode: "mock",
        provider: "mock",
        persistence: "ephemeral",
        description: "In-memory seed data — resets on server restart",
        localstackFallback: false,
      };
  }
}
