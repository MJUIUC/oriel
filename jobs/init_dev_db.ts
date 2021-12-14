import * as mongoose from "mongoose";
import * as dotenv from "dotenv";

import UserService from "../src/service/user_service";
import DeviceService from "../src/service/device_service";
import AssetService from "../src/service/asset_service";
import OpenSeaClient, { OpenSeaDigitalAsset, OpenSeaDigitalAssetResponse } from "../src/rpc_clients/open_sea_client";
import { DisplayHardwareDetailsInterface } from "../src/db_models/device_configuration_model_schema";

dotenv.config({path: "../.env"});

const mongo_user: any = process.env.MONGO_DB_USER;
const mongo_password: any = process.env.MONGO_DB_PASSWORD;
const mongo_db_name: any =  process.env.MONGO_DB_NAME;
const dev_wallet_address = process.env.DEVEL_WALLET_ADDRESS;

// TODO: Finish this job so we can generate a device_sync.json
class InitializeDevDB {
  userService: UserService = new UserService();
  deviceService: DeviceService = new DeviceService();
  assetService: AssetService = new AssetService();
  openSeaClient: OpenSeaClient = new OpenSeaClient();
  dev_wallet_address: string;
  dev_email: string;
  test_user: any;
  test_device_config: any;

  constructor(wallet_address: string, email?: string) {
    this.dev_wallet_address = wallet_address;
    this.dev_email = email;

    const mongo_uri: string = `mongodb+srv://${mongo_user}:${mongo_password}@orieldev1.fwlte.mongodb.net/${mongo_db_name}?retryWrites=true&w=majority`;
    mongoose.connect(mongo_uri, error => {
      if (error) {
        console.log(error);
      } else {
        console.log(`database connection established at: ${mongoose.connection.host} on port ${mongoose.connection.port}`);
        this.begin();
      }
    });
  }

  async begin(){
    console.log("Beginning Dev DB setup");
    const test_assets = await this.createTestAssets();
    const test_device = await this.createTestDevice();
    const test_user = await this.createTestUser();

    // TODO: 1) Add device to a user.
    // TODO: 2) Add assets to a device.
    // TODO: 3) Write function to return oriel_config.json as a result
  }
  
  async createTestUser() {
    try {
      this.test_user = await this.userService.createNewUser(this.dev_wallet_address, this.dev_email);
      return this.test_user;
    } catch (e){console.debug(e)}
  }

  async createTestDevice() {
    const dummyDisplayDeets: DisplayHardwareDetailsInterface = {
      storage_space_mbs: 320000,
      screen_height: 320,
      screen_width: 240,
      aspect_ratio: 1,
      static_image_format: "jpeg"
    }
    try {
      this.test_device_config = await this.deviceService.createNewDevice(this.dev_wallet_address, "test_device", dummyDisplayDeets);
      return this.test_device_config;
    } catch(e){console.debug(e)}
  }

  async createTestAssets() {
    try {
      const owned_assets: OpenSeaDigitalAssetResponse = await this.openSeaClient.getOwnedAssets(this.dev_wallet_address); 
      return await Promise.all(this.assetService.createDigitalAssetsFromOpenSeaResponse(owned_assets));
    } catch(e){console.debug(e)}
  }
}

const initDbClass = new InitializeDevDB(dev_wallet_address);
