import { getDataModeInfo } from "@/lib/config/data-mode";
import { env } from "@/lib/config/env";
import { AmplifyDataProvider } from "./amplify/provider";
import type { DataProvider } from "./provider";
import { MockDataProvider } from "./mock/provider";

let provider: DataProvider | null = null;
let localstackWarningLogged = false;

function warnLocalStackFallback(): void {
  if (localstackWarningLogged || env.dataMode !== "localstack") return;
  localstackWarningLogged = true;
  console.warn(
    "[data] NEXT_PUBLIC_DATA_MODE=localstack is not implemented yet. " +
      "Falling back to in-memory mock storage. Use mock mode for UI work or " +
      "amplify mode with `pnpm sandbox` for real DynamoDB persistence.",
  );
}

export function getDataProvider(): DataProvider {
  if (!provider) {
    const modeInfo = getDataModeInfo(env.dataMode);
    warnLocalStackFallback();

    switch (modeInfo.provider) {
      case "amplify":
        provider = new AmplifyDataProvider();
        break;
      case "mock":
      default:
        provider = new MockDataProvider();
        break;
    }
  }
  return provider;
}

export function getActiveDataModeInfo() {
  return getDataModeInfo(env.dataMode);
}

export function resetDataProvider(): void {
  provider = null;
}
