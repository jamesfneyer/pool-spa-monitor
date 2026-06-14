import { defineAuth } from "@aws-amplify/backend";
import { customMessage } from "./custom-message/resource";
import { getAuthEmailSenderConfig } from "./email-sender";

const emailSender = getAuthEmailSenderConfig();

export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: "CODE",
    },
  },
  triggers: {
    customMessage,
  },
  ...(emailSender ? { senders: { email: emailSender } } : {}),
});
