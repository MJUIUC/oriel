import DigitalAssetModel, { DigitalAssetModelInterface, DigitalAssetModelReferenceInterface } from "../db_models/digital_asset_model_schema";
import { UserModelInterface } from "../db_models/user_model_schema";
import {
  OpenSeaDigitalAssetResponse,
} from "../rpc_clients/open_sea_client";
import UserService from "./user_service";

export default class AssetService {
  private userService: UserService = new UserService();
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
      return Promise.reject(new AssetServiceException(e.message));
    }
  }

  /**
   * Verify And Get Digital Asset
   * ----------------------------
   * 
   * @param {string} wallet_address
   * @param {string} asset_contract_address
   * @param {string} asset_token_id
  */
 async verifyAndGetDigitalAsset(wallet_address: string, asset_contract_address: string, asset_token_id: string) {
  try {
    const digital_asset:DigitalAssetModelInterface = await this.findSingleAssetFromOriel(asset_contract_address, asset_token_id);
    
    if (wallet_address === digital_asset.asset_owner.wallet_address) {
      return digital_asset;
    } else {
      throw new Error(`Asset owner id didn't match wallet address: ${wallet_address}`);
    }
  } catch(e) {
    return Promise.reject(new AssetServiceException(e.message));
  }
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
      asset_contract_address: digital_asset.asset_contract_address,
      asset_token_id: digital_asset.asset_token_id,
    }
    return ref_asset; 
  }

  /* PRIVATE METHODS
  * ----------------
  * They return normal errors when they break
  */
  private async findSingleAssetFromOriel(
    asset_contract_address: string,
    asset_token_id: string,
  ) {
    try {
      const d_a = await DigitalAssetModel.findOne({
        asset_contract_address: String(asset_contract_address),
        asset_token_id: String(asset_token_id),
      }).exec();

      if (d_a) {
        return d_a;
      } else {
        throw new Error(`Failed to find asset with asset_contract_address: ${asset_contract_address} and asset_token_id: ${asset_token_id}`);
      }
    } catch (e) {
      return Promise.reject(new AssetServiceException(e.message));
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
