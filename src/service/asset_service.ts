import DigitalAssetModel from "../db_models/digital_asset_model_schema";

export default class AssetService {

  /**
   * Get Digital Asset
   * -----------------
   * 
  */
  async getDigitalAsset(wallet_address: string, marketpalce_asset_id: string) {
    try {
      const d_a: typeof DigitalAssetModel = await DigitalAssetModel.findOne({
        "asset_owner.wallet_address": wallet_address,
        marketplace_asset_id: marketpalce_asset_id,
      });

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
