const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserModel = mongoose.model(
    "UserModel",
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

module.exports = UserModel;
