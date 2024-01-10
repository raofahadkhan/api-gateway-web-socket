import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigwv2 from "@aws-cdk/aws-apigatewayv2-alpha";
import * as lambda from "aws-cdk-lib/aws-lambda";

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

    const webSocketHandler = new lambda.Function(
      this,
      `${service}-${stage}-post-lambda`,
      {
        functionName: `${service}-${stage}-post-lambda`,
        runtime: lambda.Runtime.NODEJS_18_X,
        code: lambda.Code.fromAsset("lambda"),
        handler: "WebsocketHandler.handler",
        environment: {
          TABLE_NAME: table.tableName,
        },
      }
    );
    const webSocketApi = new apigwv2.WebSocketApi(this, "WebSocketApi", {
      connectRouteOptions: {
        integration: new apigwv2.WebSocketIntegration(this, "WebSocketApi", {
          handler: webSocketHandler,
        }),
      },
      disconnectRouteOptions: {
        integration: new apigwv2.LambdaWebSocketIntegration({
          handler: webSocketHandler,
        }),
      },
      defaultRouteOptions: {
        integration: new apigwv2.LambdaWebSocketIntegration({
          handler: webSocketHandler,
        }),
      },
    });
  }
}
