import request from "supertest";
import {
  SetupContinuousIntegrationTest,
  setupContinuousIntegrationTest,
} from "../../../utils/setup-ci-integration";
import { INestApplication } from "@nestjs/common";

import { SetupContinuousIntegrationInitDatabaseTest } from "../../../utils/setup-ci-integration-init-db";

describe("AppController", () => {
  let app: INestApplication;
  let appContext: SetupContinuousIntegrationTest;
  beforeAll(async () => {
    const ciTest = new SetupContinuousIntegrationInitDatabaseTest();
    await ciTest.startApp();
    appContext = await setupContinuousIntegrationTest();
    app = appContext.app;
  }, 180000);

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe("root", () => {
    it('should return "apiSemanticVersion"', async () => {
      const response = await request(app.getHttpServer()).get("/").send();
      expect(response.body.data).toHaveProperty("apiSemanticVersion");
    });
  });
  describe("GET /status", () => {
    it('should return "status"', async () => {
      const response = await request(app.getHttpServer()).get("/status").send();
      expect(response.body.data).toHaveProperty("status");
    });
  });
});
