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
 * @query_param {}
*/
router.get("/oriel_config.json", async (req, res, next) => {
  try {
    const { oriel_server_version } = req;
    const { wallet_address, device_name } = req.query;
    
    res.status(200).send(await orielMainService.renderOrielDeviceCongfigurationJson(device_name, oriel_server_version, wallet_address));
  } catch(e) {console.debug(e)}
});

/**
 * Get Single Asset
 * ----------------
 * This endpoint is called to serve a single asset from a users
 * wallet to their device. The digital asset url will be quiried from
 * a given endpoint and converted to the appropriate format for the device.
 * In this case, a jpeg.
 * 
 * API params
 * @param {wallet_address}: Wallet Address associated with OpenSea marketplace
 * @param {device_id}: Device id from Oriel device config model
 * @param {asset_id}: OpenSea Asset id
*/
router.get("/asset/:wallet_address/:asset_id", async (req, res, next) => {

});

module.exports = router;
