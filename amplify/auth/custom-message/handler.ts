import type { CustomMessageTriggerHandler } from "aws-lambda";
import {
  attributeVerifyEmailHtml,
  attributeVerifyEmailSubject,
  invitationEmailHtml,
  invitationEmailSubject,
  passwordResetEmailHtml,
  passwordResetEmailSubject,
  verificationEmailHtml,
  verificationEmailSubject,
} from "../email-templates";

export const handler: CustomMessageTriggerHandler = async (event) => {
  const { codeParameter, usernameParameter } = event.request;

  switch (event.triggerSource) {
    case "CustomMessage_SignUp":
      event.response.emailSubject = verificationEmailSubject(false);
      event.response.emailMessage = verificationEmailHtml({
        codeParameter,
        isResend: false,
      });
      break;

    case "CustomMessage_ResendCode":
      event.response.emailSubject = verificationEmailSubject(true);
      event.response.emailMessage = verificationEmailHtml({
        codeParameter,
        isResend: true,
      });
      break;

    case "CustomMessage_ForgotPassword":
      event.response.emailSubject = passwordResetEmailSubject();
      event.response.emailMessage = passwordResetEmailHtml(codeParameter);
      break;

    case "CustomMessage_AdminCreateUser":
      event.response.emailSubject = invitationEmailSubject();
      event.response.emailMessage = invitationEmailHtml(
        usernameParameter ?? event.userName,
        codeParameter,
      );
      break;

    case "CustomMessage_UpdateUserAttribute":
    case "CustomMessage_VerifyUserAttribute":
      event.response.emailSubject = attributeVerifyEmailSubject();
      event.response.emailMessage = attributeVerifyEmailHtml(codeParameter);
      break;

    default:
      break;
  }

  return event;
};
