import DeviceConfigurationModel, {
  DisplayHardwareDetailsInterface,
} from "../db_models/device_configuration_model_schema";
import {
  DigitalAssetModelReferenceInterface,
} from "../db_models/digital_asset_model_schema";
import AssetService from "./asset_service";

/**
 * Device Service
 * --------------
 * Handles the CRUD operations associated
 * with device configurations.
 */
export default class DeviceService {
  assetService: AssetService = new AssetService();
  /**
   * Create New Device
   * -----------------
   * Creates a new device configuration
   */
  async createNewDevice(
    wallet_address: string,
    device_name: string,
    options?: DisplayHardwareDetailsInterface
  ) {
    try {
      const d_c = await DeviceConfigurationModel.findOne({
        device_name,
        device_owner_wallet_address: wallet_address,
      }).exec();
      if (d_c) {
        return d_c;
      } else {
        return await DeviceConfigurationModel.create({
          device_name,
          device_owner_wallet_address: wallet_address,
          display_hardware_details: options || null,
        });
      }
    } catch (e) {
      console.debug(e);
    }
  }

  /**
   * Add Asset to Device
   * -------------------
   * Adds a digital asset to a device config
   *
   * @param {*DeviceConfigurationModelInterface} device_config: The device we're adding an asset to
   * @param {DigitalAssetModelReferenceInterface} asset: A reference to the
   */
  async addAssetToDeviceByReference(
    device_config: any,
    asset_ref: DigitalAssetModelReferenceInterface
  ) {
    try {
      const device_asset_ref: DigitalAssetModelReferenceInterface =
        device_config.displayable_assets.asset_list.find(
          (asset_reference: DigitalAssetModelReferenceInterface) => {
            return this.isEqualAssetReference(asset_ref, asset_reference);
          }
        ) || null;

      if (!device_asset_ref) {
        device_config.displayable_assets.asset_list.push(asset_ref);
      }
      return;
    } catch (e) {
      console.debug(e);
    }
  }

  /* PRIVATE METHODS */
  private isEqualAssetReference(
    a: DigitalAssetModelReferenceInterface,
    b: DigitalAssetModelReferenceInterface
  ) {
    return (
      a.asset_token_id === b.asset_token_id && a.asset_contract_address === b.asset_contract_address
    );
  }
}

export class DeviceServiceException extends Error {
  constructor(message: string, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DeviceServiceException);
    }

    this.name = "DeviceServiceException";
    this.message = message;
  }
}
