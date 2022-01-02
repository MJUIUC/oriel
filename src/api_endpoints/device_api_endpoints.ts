import OrielMainService from "../service/oriel_main_service";
import { Router } from "express";
const router = Router();

const orielMainService: OrielMainService = new OrielMainService();

/***********************************************
 * This middleware exists to organize all requests made
 * by devices on the Oriel network. The device communicates
 * in JSON so all responses will be sent as stringified json, asside from
 * the live asset responses, which will be raw base64 string data.
 * 
 * TODO: Reject request where query params aren't present. Maybe should add a filter
 * for some which should be sent with every request.
 */

/**
 * Oriel Config JSON
 * ------------------
 * This endpoint serves the device display
 * configuration to the caller. Display configuration contains
 * a list of user added assets, and user or pre-defined hardware
 * characteristics.
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
    req.service_logger.info(`Successfully served oriel_config.json to owner: ${wallet_address}, and device: ${device_id}`);
  } catch (e) {
    console.debug(e);
    res.status(500).send(e);
  }
});

/**
 * Live Asset Json
 * ----------------
 * This endpoint is called to return a live asset to a device.
 *
 * API params
 * @query_param {string} wallet_address: Wallet Address associated with OpenSea marketplace
 * @query_param {string} device_id: ID of the device belonging to the user
 * @query_param {string} asset_contract_address
 * @query_param {string} asset_token_id
 */
router.get("/live_asset.json", async (req, res, next) => {
  try {
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
    req.service_logger.info(`Image served to device_id: ${device_id}, belonging to wallet_address: ${wallet_address}`);
  } catch (e) {
    next(e);
  }
});

/**
 * Sync Ready Json
 * ---------------
 * This is endpoint is called by a device to determine if
 * that device is ready to be sync'd for any reason.
 * 
 * API params
 * @query_param {string} wallet_address: Wallet Address of the device owner
 * @query_param {string} device_id: ID onboard the device
 * 
 * Always returns:
 * {
 *  device_sync_ready: true || false,
 * }
*/
router.get("/sync_ready.json", async (req, res, next) => {
  try {
    const {
      wallet_address,
      device_id,
    } = req.query;
    console.log("Requesting wallet address: ", wallet_address);
    console.log("Requesting device_id: ", device_id);
    res.status(200).send({device_sync_ready: true});
  } catch (e) {
    next(e);
  }
})

module.exports = router;
