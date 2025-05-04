// src/utils/email.ts
import SibApiV3Sdk from 'sib-api-v3-sdk';

var defaultClient = SibApiV3Sdk.ApiClient.instance;

var send ='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'
var apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = send;

// Uncomment below two lines to configure authorization using: partner-key
// var partnerKey = defaultClient.authentications['partner-key'];
// partnerKey.apiKey = 'YOUR API KEY';

var apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

var sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

export const sendContactEmail = async (toEmail: string, subject: string, messageHtml: string) => {
  const sendSmtpEmail = {
    sender: { email: 'hello@buythus.com', name: 'BuyThus' }, // FROM
    to: [{ email: toEmail }], // TO
    subject: subject,
    htmlContent: messageHtml,
  };

  try {
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent! Message ID:', response.messageId);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};
