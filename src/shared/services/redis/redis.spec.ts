/* eslint-disable prettier/prettier */
import { rootLogger } from "../../../utils/rootLogger";
import { SetupContinuousIntegrationInitDatabaseTest } from "../../../utils/setup-ci-integration-init-db";
beforeAll(async () => {
  rootLogger.log("Before all -- redis spec");
  const ciTest = new SetupContinuousIntegrationInitDatabaseTest();
  await ciTest.startApp();
}, 180000);
afterAll(async () => {
  rootLogger.log("After all -- redis spec");
});

import "./tests/redis.test";
