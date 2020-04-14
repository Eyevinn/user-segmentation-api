const redisClient = require("./helpers/redisClient");
const redisSubscriber = require("./helpers/redisSubscriber");
const logHelper = require("./helpers/logHelper");

(async () => {
  await redisSubscriber.subscribe("__keyevent@0__:expired");
  redisSubscriber.on("message", (channel, key) => {
    logHelper.log(`Received message on channel ${channel}, with key ${key}`);
    if (channel.includes("expired")) {
      const [prefix, userId, tag] = key.split(":");
      _remove(userId, tag);
    }
  });
})();

const KEY_PREFIX = "segments";
const generateKey = (...args) => args.join(":");

const THREE_MONTHS_IN_SECONDS = 1 * 60 * 60 * 24 * 30;

const input = async (userId, tags) => {
  logHelper.log(`Will add tags ${tags} to user ${userId}`);
  const tagList = tags.split(",");
  for (let tagIndex = 0; tagIndex < tagList.length; tagIndex++) {
    await _add(userId, tagList[tagIndex]);
    await _setExpiration(userId, tagList[tagIndex]);
  }
  return true;
};

const _add = async (userId, tag) => {
  logHelper.log(`Adding tag ${tag} to user ${userId}`);
  const key = generateKey(KEY_PREFIX, userId);
  const res = await redisClient.zincrby(key, 1, tag);
  logHelper.log(`New value on tag ${tag} is set, ${res}`);
  return true;
};

const _remove = async (userId, tag) => {
  logHelper.log(`Removing tag ${tag} on user ${userId}`);
  const key = generateKey(KEY_PREFIX, userId);
  const res = await redisClient.zincrby(key, -1, tag);
  logHelper.log(`New value on tag ${tag} is set, ${res}`);
  return true;
};

const _setExpiration = async (userId, tag) => {
  const key = generateKey(KEY_PREFIX, userId, tag);
  logHelper.log(`Setting the expiration for ${key}`);
  const segmentationTTL = process.env.SEGMENTATION_TTL || THREE_MONTHS_IN_SECONDS;
  await redisClient.setex(key, segmentationTTL, 1);
  return true;
};

const list = async (userId) => {
  logHelper.log(`Requesting weighted segment list for user ${userId}`);
  const key = generateKey(KEY_PREFIX, userId);
  const userSegments = await redisClient.zrange(key, 0, 10, "WITHSCORES");
  logHelper.log(userSegments);
  const rankedSegments = [];
  let segment = undefined;
  while (userSegments.length > 0) {
    const nextElement = userSegments.shift();
    if (!segment) {
      segment = {};
      segment.tag = nextElement;
    } else {
      segment.weight = nextElement;
      if (Number(segment.weight) > 0) {
        rankedSegments.push(segment);
      }
      segment = undefined;
    }
  }
  const sortedRankedSegments = rankedSegments.sort(
    (a, b) => b.weight - a.weight
  );
  return sortedRankedSegments;
};

module.exports = {
  input,
  list,
};
