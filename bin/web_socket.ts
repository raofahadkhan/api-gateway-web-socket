#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { WebSocketStack } from "../lib/web_socket-stack";

const app = new cdk.App();
const service = "web-socket";
let stage;

stage = "m";
new WebSocketStack(app, `${service}-${stage}`, {
  tags: {
    service,
    stage,
  },
});
