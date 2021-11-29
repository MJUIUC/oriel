import axios from "axios"; 

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
    async getOwnedAssets(wallet_address, offset = 0) {
        try {
            const rpcResult: any = await axios.get(`https://api.opensea.io/api/v1/assets?owner=${wallet_address}&order_direction=desc&offset=${offset}&limit=20`);
            let { assets } = rpcResult.data;
            const count = assets.length;
            return { wallet_address, asset_count: count, assets };
        } catch (e) {
            console.log(e);
            return e;
        }
    }
}
