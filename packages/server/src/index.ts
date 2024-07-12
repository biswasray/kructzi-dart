import {
  ExpressErrorHandler,
  environment,
  getIp4Addresses,
  logger,
} from "@kructzi-dart/universe";
import express from "express";
import BaseService from "./services/base";

const app = express();
const PORT = environment.NODE_PORT;

app.all("*", (req, res) => {
  res.send("Running");
});

app.use(
  ExpressErrorHandler(true, () => {
    const transaction = BaseService.GetTransaction();
    transaction?.rollback();
  }),
);
app.listen(PORT, () => {
  const ips = getIp4Addresses();
  logger.info(
    `Listening on...\n${
      ips.length
        ? ips.map((ip) => `http://${ip}:${PORT}`).join("\n")
        : `http://127.0.0.1:${PORT}`
    }`,
  );
});
