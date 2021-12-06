import * as express from "express";
import * as morgan from "morgan";
import * as dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as mongoose from "mongoose";

const app = express();
dotenv.config();

const mongo_user: any = process.env.MONGO_DB_USER;
const mongo_password: any = process.env.MONGO_DB_PASSWORD;
const mongo_db_name: any =  process.env.MONGO_DB_NAME;

const port = 8080;
const mongo_uri: string = `mongodb+srv://${mongo_user}:${mongo_password}@orieldev1.fwlte.mongodb.net/${mongo_db_name}?retryWrites=true&w=majority`;
mongoose.connect(mongo_uri, error => {
  if (error) {
    console.log(error);
  } else {
    console.log(`database connection established at: ${mongoose.connection.host} on port ${mongoose.connection.port}`);
  }
});

app.use(
  morgan("combined", {
    stream: fs.createWriteStream("./access.log", { flags: "a" }),
  })
);

app.use("/api", require(path.join(__dirname, "src", "api_endpoints", "client_api_endpoints")));
app.use("/device_api", require(path.join(__dirname, "src", 'api_endpoints', 'device_api_endpoints')));

app.listen(port, () => {
  console.log(`listening: ${port}`);
});

export default app;

// app.get("/", async (req, res, next) => {
//   try {
//     const collections_of_assets =
//       await downloader.getAllAssetsFromWalletAddress("0x1e19409843666f83d891143a2209eefe4b311408");
//     const { assets_from_collection } = collections_of_assets[0];
//     const first_asset = assets_from_collection[0];
//     const { asset_name, image_url } = first_asset;
//     const image = await downloader.downloadImageFromUrl(asset_name, image_url);
//     res.writeHead(200, {
//       "Content-Type": "image/jpeg",
//       "Content-Length": image.length,
//     });
//     res.end(image);
//   } catch (e) {
//     console.log(e);
//     res.send(e);
//   }
// });

// app.get("/wallet_sync/:wallet_address", async (req, res, next) => {
//   const owner_wallet_address = req.params.wallet_address || "nothin";
//   console.log(owner_wallet_address);
//   res.send({
//     wallet_info: {
//       name: "wallet_1",
//       createdAt: "never",
//     },
//     assets: [
//       {
//         key: 0,
//         name: "RacoonMafia102",
//         image_url: "",
//       },
//     ],
//   });
// });
