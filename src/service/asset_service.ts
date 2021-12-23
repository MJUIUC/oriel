import DigitalAssetModel, { DigitalAssetModelInterface, DigitalAssetModelReferenceInterface } from "../db_models/digital_asset_model_schema";
import {
  OpenSeaDigitalAssetResponse,
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
    return osAssetResponse.assets.map((asset: DigitalAssetModelInterface, index) => {
      return this.createDigitalAsset(asset);
    });
  }

  /**
   * Create Digital Asset
   * --------------------
   * Writes a new marketplace Digital Asset to the DB
   *
   * @param {DigitalAssetModelInterface} asset: An asset which we want to save to Oriel
   */
  async createDigitalAsset(asset: DigitalAssetModelInterface) {
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
      const foundAsset: DigitalAssetModelInterface =
        await DigitalAssetModel.findOne({
          "asset_owner.wallet_address": wallet_address,
          marketplace_asset_id
        });
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

  /**
   * Hydrate Digital Asset References
   * --------------------------------
   * Hydrates a list of oriel digital asset references
  */

  async hydrateDigitalAssetReferences(asset_references: Array<DigitalAssetModelReferenceInterface>){
    return await asset_references.map(async (asset_reference: DigitalAssetModelReferenceInterface) => {
      return await this.findSingleAssetFromOriel(asset_reference.asset_contract_address, asset_reference.asset_token_id)
    });
  }

  /**
   * Create Digital Asset Reference
   * ------------------------------
   * Creates an object which contains the base amount
   * of information to retrieve a digital asset either
   * from a marketplace, or from Oriel DB.
  */
  createDigitalAssetReference(
    digital_asset: DigitalAssetModelInterface
  ): DigitalAssetModelReferenceInterface {
    const ref_asset:DigitalAssetModelReferenceInterface = {
      name: digital_asset.name,
      asset_contract_address: digital_asset.asset_contract_address,
      asset_token_id: digital_asset.asset_token_id,
    }
    return ref_asset; 
  }

  /* PRIVATE METHODS */

  private async findSingleAssetFromOriel(
    asset_contract_address: string,
    asset_token_id: string,
  ) {
    try {
      const d_a = await DigitalAssetModel.findOne({
        asset_contract_address,
        asset_token_id,
      }).exec();

      if (d_a) {
        return d_a;
      } else {
        throw new AssetServiceException(`Failed to find asset with asset_contract_address: ${asset_contract_address} and asset_token_id: ${asset_token_id}`);
      }
    } catch (e) {
      console.debug(e);
    }
  }
}

export class AssetServiceException extends Error {
  constructor(message: string, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AssetServiceException)
    }

    this.name = "AssetServiceException"
    this.message = message;
  }
}
