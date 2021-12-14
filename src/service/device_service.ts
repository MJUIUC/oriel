import DeviceConfigurationModel, { DisplayHardwareDetailsInterface } from "../db_models/device_configuration_model_schema";

/**
 * Device Service
 * --------------
 * Handles the CRUD operations associated
 * with device configurations.
*/
export default class DeviceService {

  /**
   * Create New Device
   * -----------------
   * Creates a new device configuration
  */
  async createNewDevice(wallet_address: string, device_name: string, options?: DisplayHardwareDetailsInterface) {
    try {
      const d_c = await DeviceConfigurationModel.findOne({ device_name, device_owner_wallet_address: wallet_address }).exec();
      if (d_c) {
        return d_c;
      } else {
        return await DeviceConfigurationModel.create({
          device_name,
          device_owner_wallet_address: wallet_address,
          display_hardware_details: options || null,
        });
      }
    } catch(e) {console.debug(e)}
  }

};
