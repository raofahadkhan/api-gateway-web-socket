import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";

export class WebSocketStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const { service, stage } = props?.tags!;

    // ===============================================================================
    // DYNAMODB: CREATED DYNAMODB TABLE FOR USERS
    // ===============================================================================

    const table = new dynamodb.Table(this, `${service}-${stage}-table`, {
      tableName: `${service}-${stage}-table`,
      partitionKey: {
        name: "user_id",
        type: dynamodb.AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
    });
  }
}
