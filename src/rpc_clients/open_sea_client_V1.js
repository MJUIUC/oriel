const sharp = require("sharp");
const axios = require("axios").default;

class OpenSeaClient {


    async getAssetsFromCollection(name, owner_wallet_address, asset_contract_address){ 
        try {
            const url = `https://api.opensea.io/api/v1/assets?owner=${owner_wallet_address}&asset_contract_address=${asset_contract_address}&order_direction=desc&offset=0&limit=20`
            const result = await axios.get(url);
            // console.log(result.data);
            const assets_from_collection = result.data.assets.map(asset => {
                const {
                    image_url,
                    id: market_place_id,
                    token_id,
                    token_metadata,
                    asset_contract,
                    collection,
                } = asset;
                const { description } = asset_contract;
                const asset_name = `${collection.name.split(' ').join('_')}_${token_id}`
                return {token_id, market_place_id, asset_name, description, token_metadata, image_url};
            });
            return {collection_name: name, assets_from_collection};
        } catch(e) {
            console.log(e);
        }
    }

    async convertToJPEG(image_buffer, image_width = 240, image_height = 320) {
        let retries = 3; // should move these somewhere smarter
        while(true){
            try {
                let JPEG = await sharp(image_buffer).resize({
                    width: image_width,
                    height: image_height,
                    fit: "contain",
                }).jpeg({
                    quality: 100,
                    chromaSubsampling: '4:4:4',
                }).toBuffer();
                return JPEG
            } catch(e) {
                if (retries == 0) return;
                retries--;
                console.debug(e);
            }
        }   
    }

    /**
     * @param {image_name} name to give the downloaded image
     * @param {image_url} the url at which the image is hosted
     * @param {extension} file type/extension
     */
    async downloadImageFromUrl(image_name, image_url, extension = "jpeg") {
        try {
            const result = await axios.get(image_url, {responseType: 'arraybuffer'});
            const imageString = result.data;
            const imgBuf = Buffer.from(imageString, 'base64');
            const conversion = await this.convertToJPEG(imgBuf);
            return conversion;
        } catch(e) {
            console.log(e);
        }
    }

    getAssetsFromCollections(collections){
        return collections.map(async (collection) => {
            const {
                name,
                asset_owner_address,
                asset_contract_address
            } = collection;
            return await this.getAssetsFromCollection(name, asset_owner_address, asset_contract_address);
        });
    }

    async getCollections(asset_owner_address) {
        try {
            const result = await axios.get(`https://api.opensea.io/api/v1/collections?asset_owner=${asset_owner_address}&offset=0`);
            return result.data.map((item, index) => {
                const { primary_asset_contracts } = item;
                const {
                    address: asset_contract_address,
                    name,
                } = primary_asset_contracts[0];
                
                return {key: index, name, asset_owner_address, asset_contract_address,};
            });
        } catch(e) {
            console.log(e);
        }
    }

    /**
     * @param {wallet_address} The wallet address to downlaod assets from
    */
    async getAllAssetsFromWalletAddress(wallet_address){
        try {
            const collections = await this.getCollections(wallet_address);
            const marketAssets = await Promise.all(this.getAssetsFromCollections(collections));
            return marketAssets
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = { OpenSeaClient };
// getAssets("0xea28a3a7c6757334b4c0fbb2d3ebe8992a17b830", "0xbd3531da5cf5857e7cfaa92426877b022e612cf8");
// getImage("https://lh3.googleusercontent.com/ibjUDVjAvvT4yN5uuplWVSL7q9SD3WdDhJWkpdkHtT-NkOCdnKIuFVzdntP4sQ2BcLyf2I2hwFI-IdaxUOqXBZ6g0jS_jcR9ud2Syg=s300");
