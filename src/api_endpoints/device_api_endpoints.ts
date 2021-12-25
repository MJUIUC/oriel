import OrielMainService from "../service/oriel_main_service";
import { Router } from "express";
const router = Router();

const orielMainService: OrielMainService = new OrielMainService();

/**
 * This middleware exists to handle requests
 * replated to specific devices. Applications
 * meant to display digital assets via Oriel
 * will call these endpoints.
 */

/**
 * Oriel Config JSON
 * ------------------
 * This endpoint serves the device display
 * configuration to the caller.
 *
 * TODO: Call main service class to render a device configuration json
 *
 * API params
 * @query_param {wallet_address}: Wallet Address associated with OpenSea marketplace
 * @query_param {device_id}: Unique ID of the device. Just a Mongodb _id
 */
router.get("/oriel_config.json", async (req, res, next) => {
  try {
    const { oriel_server_version } = req;
    const { wallet_address, device_id } = req.query;
    
    res
      .status(200)
      .send(
        await orielMainService.renderOrielDeviceCongfigurationJson(
          device_id,
          oriel_server_version,
          wallet_address
        )
      );
  } catch (e) {
    console.debug(e);
    res.status(500).send(e);
  }
});

/**
 * Get Single Asset
 * ----------------
 * This endpoint is called to return a live asset to a device.
 *
 * API params
 * @query_param {string} wallet_address: Wallet Address associated with OpenSea marketplace
 * @query_param {string} device_id: ID of the device belonging to the user
 * @query_param {string} asset_contract_address
 * @query_param {string} asset_token_id
 */
router.get("/asset", async (req, res, next) => {
  try {
    //TODO: Update model to use mongo device id instead of entire object
    const {
      wallet_address,
      device_id,
      asset_contract_address,
      asset_token_id,
    } = req.query;
    const live_asset = await orielMainService.renderLiveAsset(
      wallet_address,
      device_id,
      asset_contract_address,
      asset_token_id
    );
    res.writeHead(200, {
      "Content-Type": `image/${live_asset.content_type}`,
      "Content-Length": live_asset.content_length,
    });
    res.end(live_asset.device_spec_live_asset_buffer);
  } catch (e) {
    console.debug(e);
    next(e);
  }
});

module.exports = router;
