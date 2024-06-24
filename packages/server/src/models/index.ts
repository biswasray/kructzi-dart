import { Sequelize } from "sequelize";
// import { initModels } from "./init_models";
import { environment } from "@aparage-health/universe";

export const sequelize = new Sequelize({
  // host: "0.0.0.0" || "postgresdb",
  host: environment.POSTGRESDB_HOST,
  port: Number(environment.POSTGRESDB_PORT),
  username: environment.POSTGRESDB_USER,
  password: environment.POSTGRESDB_ROOT_PASSWORD,
  database: environment.POSTGRESDB_DATABASE,
  dialect: "postgres",
});

// sequelize.sync({ force: true });
sequelize.authenticate();

// export const models = initModels(sequelize);

// function modelSelector<K extends keyof typeof models>(
//   key: K,
// ): (typeof models)[K] {
//   return models[key];
// }

// const Models = Object.assign(modelSelector, {});

// export default Models;
