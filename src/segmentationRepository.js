const redisClient = require("./helpers/redisClient");
const logHelper = require("./helpers/logHelper");

const KEY_PREFIX = "segments";
const generateKey = (...args) => args.join(":");

const input = async (userId, tags) => {
  logHelper.log(`Will add tags ${tags} to user ${userId}`);
  const tagList = tags.split(",");
  for (let tagIndex = 0; tagIndex < tagList.length; tagIndex++) {
    await addSegmentToUser(userId, tagList[tagIndex]);
  }
  return true;
};

const addSegmentToUser = async (userId, tag) => {
  logHelper.log(`Adding tag ${tag} to user ${userId}`);
  const key = generateKey(KEY_PREFIX, userId);
  const currentWeight = await redisClient.zscore(key, tag);
  const newWeight = (currentWeight ? Number(currentWeight) + 1 : 1).toString();
  logHelper.log(`Updating value of tag ${tag} to ${newWeight}`);
  const res = await redisClient.zadd(key, newWeight, tag);
  logHelper.log(`New value on tag ${tag} is set, ${res}`);
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
      rankedSegments.push(segment);
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
