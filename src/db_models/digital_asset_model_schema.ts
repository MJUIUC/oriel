import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface DigitalAssetModelReferenceInterface {
  asset_contract_address: string,
  asset_token_id: string,
}

export interface DigitalAssetModelInterface {
  name: string,
  marketplace_asset_id: string, /* They'll all be OpenSea to begin with */
  asset_contract_address: string,
  asset_token_id: string,
  asset_image_urls: {
    animation_url?: string,
    animation_original_url?: string,
    image_url?: string,
    image_preview_url?: string,
    image_thumbnail_url?: string,
    image_original_url?: string,
  },
  asset_owner: {
    wallet_address: string,
    osm_username: string
  },
  _collection: {
    name: string,
    slug: string,
  },
  save: any,
  _id: any,
}

/**
 * Digital Asset Model
 * -------------------
 * A model for digital assets tied to a token. Assets
 * are collectible from multiple sources, or marketplaces.
 */
const DigitalAssetModel = mongoose.model<DigitalAssetModelInterface>(
  "DigitalAssetModel",
  new Schema<DigitalAssetModelInterface>(
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
