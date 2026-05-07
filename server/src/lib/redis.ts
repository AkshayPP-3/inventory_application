import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL as string, {
  tls: true,
  maxRetriesPerRequest: null,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError: (err) => {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
});

redis.on("connect", () => {
  console.log("✓ Redis Connected");
});

redis.on("error", (err) => {
  console.error("✗ Redis Error:", err);
});
