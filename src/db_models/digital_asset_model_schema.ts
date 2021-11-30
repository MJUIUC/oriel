import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
 * Digital Asset Model
 * -------------------
 * A model for digital assets tied to a token. Assets
 * are collectible from multiple sources, or marketplaces.
 * 
 * note osm -> Open Sea Marketplace
*/
const DigitalAssetModel = mongoose.model(
  "DigitalAssetModel",
  new Schema({
    name: String,
    osm_asset_id: Number,
    asset_contract_address: String,
    asset_token_id: String,
    asset_image_urls: {
      animation_url: String,
      animation_original_url: String,
      image_url: String,
      image_preview_url: String,
      image_thumbnail_url: String,
      image_original_url: String,
    },
    asset_owner: {
      wallet_address: String,
      osm_username: String
    },
  }, { timestamps: true })
);

export default DigitalAssetModel;
