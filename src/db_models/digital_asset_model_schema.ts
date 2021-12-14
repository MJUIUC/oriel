import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

/**
 * Digital Asset Model
 * -------------------
 * A model for digital assets tied to a token. Assets
 * are collectible from multiple sources, or marketplaces.
 */
const DigitalAssetModel = mongoose.model(
  "DigitalAssetModel",
  new Schema(
    {
      name: String,
      marketplace_asset_id: String /* They'll all be OpenSea to begin with */,
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
      //   /**
      //    * Asset Owner
      //    * -----------
      //    * This will belong to the actual owner of the asset. If ownership changes,
      //    * we should write a method to reflect that change and update the respective asset.
      //    *
      //    * TODO: Write a method which checks/updates asset ownership before making a final oriel_config.json (was wallet_config.json)
      //    * */
      asset_owner: {
        wallet_address: String,
        osm_username: String,
      },
      _collection: {
        name: String,
        slug: String,
      },
    },
    { timestamps: true }
  )
);

export default DigitalAssetModel;
