import OpenSeaClient from "../rpc_clients/open_sea_client";
import UserService from "../service/user_service";
import { Router } from "express";
const router = Router();

const devWalletAddress = process.env.DEVEL_WALLET_ADDRESS;
const openSeaClient: OpenSeaClient = new OpenSeaClient();
const userService: UserService = new UserService();

/**
 * This middleware exists for handling all requests
 * from the Oriel web client or device configuration
 * clients. Not to be confused with the device endpoints,
 * these endpoints will still involve "device" in their names.
*/

// TODO: Add middleware for error handling

/**
 * /assets
 * -----------
 * @method {GET}
 * 
 * @query_param {String} wallet_address: Address of asset owning wallet.
 * @query_param {String} offset: Section of osm assets to display. Only 20 returned at a time from api
 * 
 * This endpoint simply retrieves assets from OSM given a
 * wallet address and offset amount.
*/
router.get("/assets", async (req, res, next) => {
    const { offset, wallet_address } = req.query;
    const w_a = devWalletAddress || wallet_address;
    try {
        const result = await openSeaClient.getOwnedAssets(w_a, Number(offset || 0));
        res.send(result);
    } catch (e) {
        console.log(e);
        next();
    }
});

/**
 * /initialize_user
 * ----------------
 * @method {POST}
 * 
 * This endpoint will be called to initialize a new user from the
 * web client. Should call a service method to perform some checks,
 * with a returned Promise to try withint the async callback.
 * 
 * @body {
 *   wallet_address: "0x302jhf13jhgf...",
 *   email?: "marcus@oriel.net"
 * }
*/
router.post("/initialize_user", async (req, res, next) => {
    const { wallet_address, email } = req.body;
    try {
        const newUser:Promise<any> = await userService.createNewUser(wallet_address, email);
        if (newUser) {
          res.status(200).send(newUser);
        }
    } catch (e) {
        console.log(e);
        next();
    }
});

module.exports = router;
