import Fastify from "fastify";
import { main } from "./puppeteer";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3003;
const HOST = process.env.HOST || "0.0.0.0";

const fastify = Fastify({ logger: true });

const querySchemaZod = z.object({
  lat: z.string(),
  log: z.string(),
});

fastify.get("/api", async function handler(request, reply: any) {
  const { log, lat } = querySchemaZod.parse(request.query);

  if (!lat || !log) {
    return reply
      .code(400)
      .send({ error: "Latitude e longitude são obrigatórias" });
  }

  const res = await main({ lat, log });

  return res;
});

fastify.get("/", async function handler() {
  return { msg: "Pong" };
});

fastify.listen({ port: PORT, host: HOST }, () =>
  console.log(`Server is ready! Listening on port ${PORT}`),
);
