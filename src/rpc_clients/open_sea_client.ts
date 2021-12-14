import axios from "axios";

export interface OpenSeaDigitalAsset {
  name: string,
  oriel_owner_wallet_address?: string,
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
}

export interface OpenSeaDigitalAssetResponse {
  wallet_address: string,
  asset_count: number,
  assets?: [OpenSeaDigitalAsset]
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
          const trans_asset: OpenSeaDigitalAsset = {
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
            }
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
