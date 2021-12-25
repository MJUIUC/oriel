import axios from "axios";
import { DigitalAssetModelInterface } from "../db_models/digital_asset_model_schema";

export interface OpenSeaDigitalAssetResponse {
  wallet_address: string,
  asset_count: number,
  assets?: [DigitalAssetModelInterface]
}

/**
 * Open Sea Client
 * ---------------
 * Connects to the Open Sea Marketplace API as a client to retriev
 * assets associated with a specific wallet address.
*/
export default class OpenSeaClient {

    /**
     * Get Owned Assets
     * -----------------
     * Returns all assets belonging to an address, up to
     * fifty at a time. To view more, adjust the offset argument.
     * 
     * @param {String} wallet_address : Wallet address of the owner
     * @param {Number} offset : Where to start downloading assets
     * @returns {Object} { wallet_address, asset_count, assets }
     */
    async getOwnedAssets(wallet_address: string, offset: number = 0) {
        try {
            const rpcResult: any = await axios.get(`https://api.opensea.io/api/v1/assets?owner=${wallet_address}&order_direction=desc&offset=${offset}&limit=20`);
            let { assets } = rpcResult.data;
            const count = assets.length;
            const transposedAssets = assets.map(asset => {return transposeAsset(asset)})
            const response: OpenSeaDigitalAssetResponse = { wallet_address, asset_count: count, assets: transposedAssets };
            return response;
        } catch (e) {
            console.log(e);
            return e;
        }
        // Trim asset from response
        function transposeAsset(asset: any) {
          const trans_asset: DigitalAssetModelInterface = {
            name: asset.name,
            marketplace_asset_id: asset.id,
            asset_contract_address: asset.asset_contract.address,
            asset_token_id: asset.token_id,
            asset_owner: {
              wallet_address: asset.owner.address,
              osm_username: asset.owner.user.username,
            },
            asset_image_urls: {
              animation_url: asset.animation_url,
              animation_original_url: asset.animation_original_url,
              image_url: asset.image_url,
              image_preview_url: asset.image_preview_url,
              image_thumbnail_url: asset.image_thumbnail_url,
              image_original_url: asset.image_original_url,
            },
            _collection: {
              name: asset.collection.name,
              slug: asset.collection.slug,
            },
            save: null,
            _id: null,
          }
          return trans_asset;
        }
    }

    /**
     * Get Single Asset
     * ----------------
     * Returns a single digital asset from the marketplace
     * 
     * @param {String} contract_address: Address of the contract for this asset
     * @param {String} token_id: Token ID for this asset
    */
   async getSingleAsset(contract_address: string, token_id: string) {
       try {
        const rpcResult: any = await axios.get(`https://api.opensea.io/api/v1/asset/${contract_address}/${token_id}/`);
        return rpcResult.data;
       } catch(e) {
           console.log(e);
           return e;
       }
   }
}
