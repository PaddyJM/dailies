import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as sns from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import 'dotenv/config'
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as iam from 'aws-cdk-lib/aws-iam';

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

    const reminderFunction = new NodejsFunction(this, 'DailiesReminderFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      entry: 'src/dailies-reminder/index.ts',
      environment: {
        TOPIC_ARN: topic.topicArn
      },
    })

    const lambdaSnsPolicy = new iam.PolicyStatement({
      actions: ['sns:Publish'],
      resources: [topic.topicArn],
    });

    reminderFunction.addToRolePolicy(lambdaSnsPolicy);
  }
}
