const redisClient = require("./helpers/redisClient");
const logHelper = require("./helpers/logHelper");

const KEY_PREFIX = "segments";
const generateKey = (...args) => args.join(":");

const input = async (userId, tags) => {
  logHelper.log(`Will add tags ${tags} to user ${userId}`);
  const tagList = tags.split(",");
  for (let tagIndex = 0; tagIndex < tagList.length; tagIndex++) {
    await _add(userId, tagList[tagIndex]);
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
