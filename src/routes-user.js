const segmentationRepository = require("./segmentationRepository");
const utils = require("./helpers/utils");

module.exports = (fastify, opts, next) => {
  fastify.get("/:userId/segments", async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.code(500).send("Missing required userId");
    }
    const segments = await segmentationRepository.list(userId);

    res.header("Cache-Control", "public, no-cache").code(200).send(segments);
  });

  fastify.get("/:userId/interest", async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.code(500).send("Missing required userId");
    }
    const segments = await segmentationRepository.list(userId);
    const interest = utils.getRandomWeighted(segments);
    res.header("Cache-Control", "public, no-cache").code(200).send(interest);
  });

  next();
};
