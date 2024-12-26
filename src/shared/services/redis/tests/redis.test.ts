import { Test, TestingModule } from "@nestjs/testing";
import { RedisService } from "../redis.service";
import { AppModule } from "../../../../modules/app/app.module";
import { redisCacheKey } from "../../../../utils/generate-key";
import { waitTime } from "../../../../utils/wait-time";

describe("RedisService", () => {
  let redis: RedisService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    redis = moduleFixture.get<RedisService>(RedisService);
  });

  afterEach(async () => {
    await redis.flushAll();
    jest.clearAllMocks();
  });

  describe("Test redis service", () => {
    it("should return success when set then get", async () => {
      const cacheKey = redisCacheKey("test");
      await redis.setValue(cacheKey, {
        contractAddress: "0x6d04F380d868Bca04701283059155597c4C0ffD1",
        starkKey:
          "0x7c65c1e82e2e662f728b4fa42485e3a0a5d2f346baa9455e3e70682c2094ad1",
      });
      const cacheData = await redis.getValue(cacheKey);
      expect(cacheData).toMatchObject({
        contractAddress: "0x6d04F380d868Bca04701283059155597c4C0ffD1",
        starkKey:
          "0x7c65c1e82e2e662f728b4fa42485e3a0a5d2f346baa9455e3e70682c2094ad1",
      });
    });
    it("should return null when set then get after expired", async () => {
      const cacheKey = redisCacheKey("test");

      await redis.setValue(
        cacheKey,
        {
          contractAddress: "0x6d04F380d868Bca04701283059155597c4C0ffD1",
          starkKey:
            "0x7c65c1e82e2e662f728b4fa42485e3a0a5d2f346baa9455e3e70682c2094ad1",
        },
        1
      );
      await waitTime(2000);
      const cacheData = await redis.getValue(cacheKey);
      expect(cacheData).toEqual(null);
    });
    it("should return null when set then delete then get", async () => {
      const cacheKey = redisCacheKey("test");
      await redis.setValue(cacheKey, {
        contractAddress: "0x6d04F380d868Bca04701283059155597c4C0ffD1",
        starkKey:
          "0x7c65c1e82e2e662f728b4fa42485e3a0a5d2f346baa9455e3e70682c2094ad1",
      });
      await redis.deleteValue(cacheKey);
      const cacheData = await redis.getValue(cacheKey);
      expect(cacheData).toEqual(null);
    });
    it("should return null when set cache then flush all then get", async () => {
      const cacheKey = redisCacheKey("test");
      await redis.setValue(cacheKey, {
        contractAddress: "0x6d04F380d868Bca04701283059155597c4C0ffD1",
        starkKey:
          "0x7c65c1e82e2e662f728b4fa42485e3a0a5d2f346baa9455e3e70682c2094ad1",
      });
      await redis.flushAll();
      const cacheData = await redis.getValue(cacheKey);
      expect(cacheData).toEqual(null);
    });
    it("should return null when delete keys by pattern", async () => {
      const cacheKey1 = redisCacheKey("group:test-1");
      await redis.setValue(cacheKey1, {
        contractAddress: "0x6d04F380d868Bca04701283059155597c4C0ffD1",
        starkKey:
          "0x7c65c1e82e2e662f728b4fa42485e3a0a5d2f346baa9455e3e70682c2094ad1",
      });
      const cacheKey2 = redisCacheKey("group:test-2");
      await redis.setValue(cacheKey2, {
        contractAddress: "0x6d04F380d868Bca04701283059155597c4C0ffD1",
        starkKey:
          "0x7c65c1e82e2e662f728b4fa42485e3a0a5d2f346baa9455e3e70682c2094ad1",
      });
      const cacheKeyGroup = redisCacheKey("group");
      const cacheData = await redis.deleteItemsByPrefixKey(cacheKeyGroup);
      expect(cacheData?.length).toEqual(2);

      expect(await redis.getValue(cacheKey1)).toEqual(null);
      expect(await redis.getValue(cacheKey2)).toEqual(null);
    });
  });
});
