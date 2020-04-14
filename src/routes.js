const segmentationRepository = require("./segmentationRepository");

module.exports = (fastify, opts, next) => {
  fastify.post("/:userId/:tags", async (req, res) => {
    const userId = req.params.userId;
    const tags = req.params.tags;
    if (!userId || !tags) return res.code(500).send();

    const store = await segmentationRepository.input(userId, tags);

    res.header("Cache-Control", "public, no-cache").code(200).send(store);
  });

  fastify.get("/:userId", async (req, res) => {
    const userId = req.params.userId;
    if (!userId) {
      return res.code(500).send("Missing required userId");
    }

    const segments = await segmentationRepository.list(userId);

    res.header("Cache-Control", "public, no-cache").code(200).send(segments);
  });

  fastify.get("/segment/:tag", async (req, res) => {
    // TODO: Get the amount of users in a segment tag
  });

  next();
};
