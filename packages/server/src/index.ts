import { add, environment } from "@aparage-health/universe";
import express from "express";
import { sequelize } from "./models";
// import { config } from "dotenv";
// import { add } from "@aparage-health/universe";
// config();
const app = express();
const PORT = environment.NODE_PORT;

app.all("*", (req, res) => {
  res.json({ sum: add(20, 4) });
});
sequelize;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
