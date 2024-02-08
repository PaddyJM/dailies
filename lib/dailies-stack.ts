import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import 'dotenv/config'

export class DailiesStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const topic = new sns.Topic(this, 'DailiesTopic', {
      displayName: 'Dailies Topic',
    });

    if(!process.env.MY_EMAIL) {
      throw new Error('Please set the MY_EMAIL environment variable')
    }

    topic.addSubscription(new EmailSubscription(process.env.MY_EMAIL))
  }
}
