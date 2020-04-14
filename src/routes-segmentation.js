const segmentationRepository = require("./segmentationRepository");
const utils = require("./helpers/utils");

module.exports = (fastify, opts, next) => {
  fastify.post("/:userId/:tags", async (req, res) => {
    const userId = req.params.userId;
    const tags = req.params.tags;
    if (!userId || !tags) return res.code(500).send();

    const store = await segmentationRepository.input(userId, tags);

    res.header("Cache-Control", "public, no-cache").code(200).send(store);
  });

  fastify.get("/segment/:tag", async (req, res) => {
    const tag = req.params.tag;
    const list = await segmentationRepository.userGroupSize(tag);
    res.header("Cache-Control", "public, no-cache").code(200).send(list);
  });

  next();
};
