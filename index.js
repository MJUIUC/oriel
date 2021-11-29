const express = require("express");
const morgan = require("morgan");
const fs = require("fs");
const app = express();
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const port = 8080;

app.use(
  morgan("combined", {
    stream: fs.createWriteStream("./access.log", { flags: "a" }),
  })
);

app.use("/api", require(path.join(__dirname, "endpoints", "client_api_endpoints")));
app.use("/device_api", require(path.join(__dirname, 'endpoints', 'device_api_endpoints')));

app.listen(port, () => {
  console.log(`listening: ${port}`);
});

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
