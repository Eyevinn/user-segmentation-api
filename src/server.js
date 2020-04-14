const fastify = require("fastify")({
  ignoreTrailingSlash: true,
});
const cors = require("cors");
fastify.use(cors());

const fastifyRateLimit = require("fastify-rate-limit");
fastify.register(fastifyRateLimit, {
  max: 25,
  timeWindow: "1 minute",
});

fastify.register(require("./routes-segmentation"), {
  prefix: "/segmentation",
});
fastify.register(require("./routes-user"), {
  prefix: "/user",
});

module.exports = fastify;
