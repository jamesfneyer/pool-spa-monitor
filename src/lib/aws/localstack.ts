import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { env } from "@/lib/config/env";

/** Reserved for a future LocalStackDataProvider — not used by the app data layer yet. */
export function createLocalStackDynamoClient() {
  const client = new DynamoDBClient({
    region: env.awsRegion,
    endpoint: env.awsEndpoint,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "test",
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "test",
    },
  });

  return DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  });
}

export function isLocalStackConfigured(): boolean {
  return env.dataMode === "localstack";
}
