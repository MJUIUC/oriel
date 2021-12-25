import * as express from "express";
import * as dotenv from "dotenv";
import * as path from "path";
import * as mongoose from "mongoose";
import * as bodyParser from "body-parser";
import ServiceLogger from "./src/utilities/service_logger";

const app = express();
dotenv.config();

const mongo_user: any = process.env.MONGO_DB_USER;
const mongo_password: any = process.env.MONGO_DB_PASSWORD;
const mongo_db_name: any =  process.env.MONGO_DB_NAME;

const server_version: any = process.env.ORIEL_SERVICE_VERSION;

const port = 8080;
const mongo_uri: string = `mongodb+srv://${mongo_user}:${mongo_password}@orieldev1.fwlte.mongodb.net/${mongo_db_name}?retryWrites=true&w=majority`;
mongoose.connect(mongo_uri, error => {
  if (error) {
    console.log(error);
  } else {
    console.log(`database connection established at: ${mongoose.connection.host} on port ${mongoose.connection.port}`);
  }
});
const service_logger = new ServiceLogger(path.join(__dirname, "logs"));

// add body parser
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
// add access logs
app.use((req, res, next) => {service_logger._logServiceAccess(req, res, next)});
// add objects to request object
app.use((req, res, next) => {
  req.oriel_server_version = server_version;
  req.service_logger = service_logger;
  next();
})
app.use("/client", require(path.join(__dirname, "src", "api_endpoints", "client_api_endpoints")));
app.use("/device", require(path.join(__dirname, "src", 'api_endpoints', 'device_api_endpoints')));

app.listen(port, () => {
  console.log(`Server listening on port: ${port}\nOriel Server Version: ${server_version}`);
});

export default app;
