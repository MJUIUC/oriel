import OpenSeaClient from "../rpc_clients/open_sea_client" 
import { Router } from "express";
const router = Router();

const devWalletAddress = process.env.DEVEL_WALLET_ADDRESS;
const openSeaClient = new OpenSeaClient();

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
 * Add New Wallet
 * ---------------------
 * This will start a new wallet object. It
 * should be called when a new wallet address it entered
 * by a client. The endpoint will create a new Wallet
 * Object in a datastore (likely mongo) which will house a users
 * NFT asset collection as well as a list of devices to display
 * those assets on.
*/
router.post("/a", async (req, res, next) => {
    // console.log(openSeaClient.getCollections(devWalletAddress));
    next();
});

module.exports = router;
