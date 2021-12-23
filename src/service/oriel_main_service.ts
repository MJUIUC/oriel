import { DeviceConfigurationModelInterface } from "../db_models/device_configuration_model_schema";
import { UserModelInterface } from "../db_models/user_model_schema";
import UserService from "./user_service";
import { DigitalAssetModelReferenceInterface } from "../db_models/digital_asset_model_schema";
import * as date from 'date-and-time';

/**
 * Oriel Main Service
 * ------------------
 * Contains methods and operations which require multiple
 * service classes.
 */
export default class OrielMainService {
  private userService: UserService = new UserService();

  /**
   * Render Oriel Device Config Json
   * -------------------------------
   * Renders an oriel device config json
   */
  async renderOrielDeviceCongfigurationJson(
    device_name: string,
    server_version: string,
    wallet_address: string,
    email?: string
  ) {
    try {
      const user: UserModelInterface = await this.userService.getOrielUser(
        wallet_address,
        email
      );
      const device = user.owned_device_configurations.find(
        (d_n: DeviceConfigurationModelInterface) => {
          return device_name === d_n.device_name;
        }
      );
      if (device) {
        // TODO: Think about what should be on the device. Probably just the refs right?
        const asset_references: Array<DigitalAssetModelReferenceInterface> = device.displayable_assets.asset_list;
        const d_date = date.format(new Date(), 'YYYY/MM/DD HH:mm:ss');
        return ({
          device_name,
          server_version,
          wallet_address,
          download_date: d_date,
          number_of_assets_on_device: asset_references.length,
          asset_references,
        });
      } else {
        throw new OrielMainServiceException(`Device ${device_name} not found`);
      }
    } catch (e) {
      console.debug(e);
      return e;
    }
  }
}

export class OrielMainServiceException extends Error {
  constructor(message: string, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, OrielMainServiceException);
    }

    this.name = "OrielMainServiceException";
    this.message = message;
  }
}
