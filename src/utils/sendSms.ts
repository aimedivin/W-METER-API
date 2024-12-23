import twilio from 'twilio';

const sendSms = async (receiverNumber: string, message: string) => {
  try {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const senderNumber = process.env.TWILIO_SENDER_NUMBER;

    const client = twilio(accountSid, authToken);

    await client.messages.create({
      from: senderNumber,
      body: message,
      to: receiverNumber,
    });
  } catch (error) {
    return error;
  }
};
export default sendSms;
