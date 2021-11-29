const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/**
 * Digital Asset Model
 * -------------------
 * A model for digital assets tied to a token. Assets
 * are collectible from multiple sources, or marketplaces.
 * 
*/
const DigitalAssetModel = mongoose.model(
  "DigitalAssetModel",
  new Schema({
    osm_asset_id: {
      type: Number,
      default: null,
    },
    asset_owner: {
      type: Object,
      default: null,
    }
  }, { timestamps: true })
);

module.exports = DigitalAssetModel;
