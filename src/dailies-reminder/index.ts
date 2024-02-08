import { SNS } from '@aws-sdk/client-sns';
import 'dotenv/config';

export const handler = async (event: any) => {
  const sns = new SNS();

  try {
    await sns.publish({ Message: 'Hello, world!', TopicArn: process.env.TOPIC_ARN, Subject: 'Dailies Reminder' });
    console.log('Message published successfully');
  } catch (error) {
    console.error('Error publishing message:', error);
  }
};
