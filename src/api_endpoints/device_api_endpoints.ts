import { Router } from "express";
const router = Router();

/**
 * This middleware exists to handle requests
 * replated to specific devices. Applications
 * meant to display digital assets via Oriel
 * will call these endpoints.
*/

/**
 * Wallet Config Sync
 * ------------------
 * This endpoint is called to serve a wallet configuration
 * json string based on the current state of the users assets
 * set to be on display for their device.
 * 
 * API params
 * @param {wallet_address}: Wallet Address associated with OpenSea marketplace
*/
router.get("/wallet_sync/:wallet_address", async (req, res, next) => {
    
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
router.get("/single_asset/:wallet_address/:asset_id", async (req, res, next) => {

});

module.exports = router;
