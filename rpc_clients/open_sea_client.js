const axios = require("axios").default;

class OpenSeaClient {

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
            const rpcResult = await axios.get(`https://api.opensea.io/api/v1/assets?owner=${wallet_address}&order_direction=desc&offset=${offset}&limit=20`);
            const { assets } = rpcResult.data;
            const count = assets.length;
            return { wallet_address, asset_count: count, assets };
        } catch (e) {
            return e;
            console.log(e);
        }
    }
}

module.exports = { OpenSeaClient };