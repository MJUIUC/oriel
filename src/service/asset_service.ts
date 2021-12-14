import DigitalAssetModel from "../db_models/digital_asset_model_schema";
import {
  OpenSeaDigitalAssetResponse,
  OpenSeaDigitalAsset,
} from "../rpc_clients/open_sea_client";

export default class AssetService {
  /**
   * Create Digital Asset From OpenSea Response
   * --------------------
   * Creates a DigitalAssetModelObject in app DB using a
   * model interface from a respective marketplace client.
   * Eventually will contain other marketplace asset responses.
   *
   * @param {OpenSeaDigitalAssetResponse} osAssetResponse
   */
  createDigitalAssetsFromOpenSeaResponse(
    osAssetResponse?: OpenSeaDigitalAssetResponse
  ) {
    return osAssetResponse.assets.map((asset: OpenSeaDigitalAsset, index) => {
      return this.createDigitalAsset(asset);
    });
  }

  /**
   * Create Digital Asset
   * --------------------
   * Writes a new marketplace Digital Asset to the DB
   *
   * @param {OpenSeaDigitalAsset} asset: An asset which we want to save to Oriel
   */
  async createDigitalAsset(asset: OpenSeaDigitalAsset) {
    const { wallet_address } = asset.asset_owner;
    const {
      name,
      marketplace_asset_id,
      asset_contract_address,
      asset_token_id,
      asset_owner,
      asset_image_urls,
      _collection,
    } = asset;
    try {
      const foundAsset: OpenSeaDigitalAsset =
        await this.findSingleAssetFromOriel(
          wallet_address,
          marketplace_asset_id
        );
      if (foundAsset) {
        return foundAsset;
      } else {
        return await DigitalAssetModel.create({
          name: name,
          marketplace_asset_id,
          asset_contract_address,
          asset_token_id,
          asset_owner,
          asset_image_urls,
          _collection,
        });
      }
    } catch (e) {
      console.debug(e);
    }
  }

  /**
   * Get Digital Asset
   * -----------------
   * Get a Digital Asset Model Object from app DB.
   * Does not make a call to an online marketplace.
   *
   * @param {string} wallet_address
   * @param {string} marketpalce_asset_id
   *
   * @return DigitalAssetModelObject if found else null
   */
  async getDigitalAsset(wallet_address: string, marketpalce_asset_id: string) {
    return this.findSingleAssetFromOriel(wallet_address, marketpalce_asset_id);
  }

  /* PRIVATE METHODS */

  private async findSingleAssetFromOriel(
    wallet_address: string,
    marketpalce_asset_id: string
  ) {
    try {
      const d_a = await DigitalAssetModel.findOne({
        "asset_owner.wallet_address": wallet_address,
        marketplace_asset_id: marketpalce_asset_id,
      }).exec();

      if (d_a) {
        return d_a;
      } else {
        return null;
      }
    } catch (e) {
      console.debug(e);
    }
  }
}
