import { Amplify } from "aws-amplify";
import outputs from "../../../amplify_outputs.json";

let configured = false;

export function isAmplifySandboxReady(): boolean {
  return outputs.auth.user_pool_id !== "REPLACE_AFTER_SANDBOX";
}

export function configureAmplify() {
  if (configured) return;

  if (isAmplifySandboxReady()) {
    Amplify.configure(outputs, { ssr: true });
    configured = true;
  }
}

export function isAmplifyConfigured(): boolean {
  if (!configured) {
    configureAmplify();
  }
  return configured;
}
