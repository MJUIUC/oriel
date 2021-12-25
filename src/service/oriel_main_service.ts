import { DeviceConfigurationModelInterface } from "../db_models/device_configuration_model_schema";
import { UserModelInterface } from "../db_models/user_model_schema";
import UserService from "./user_service";
import {
  DigitalAssetModelInterface,
  DigitalAssetModelReferenceInterface,
} from "../db_models/digital_asset_model_schema";
import * as date from "date-and-time";
import DeviceService from "./device_service";
import AssetService from "./asset_service";
import ImageConverter from "../utilities/image_converter";
import LiveAssetDownloader from "../rpc_clients/live_asset_downloader";

/**
 * Oriel Main Service
 * ------------------
 * Contains methods and operations which require multiple
 * service classes.
 */
export default class OrielMainService {
  private userService: UserService = new UserService();
  private deviceService: DeviceService = new DeviceService();
  private assetService: AssetService = new AssetService();
  private imageConverter: ImageConverter = new ImageConverter();
  private liveAssetDownloader: LiveAssetDownloader = new LiveAssetDownloader();

  /**
   * Render Oriel Device Config Json
   * -------------------------------
   * Renders an oriel device config json
   *
   * @param {string} device_id
   * @param {string} server_version
   * @param {string} wallet_address
   * @param {string?} wallet_address
   *
   */
  async renderOrielDeviceCongfigurationJson(
    device_id: string,
    server_version: string,
    wallet_address: string,
    email?: string
  ) {
    try {
      const user: UserModelInterface = await this.userService.getOrielUser(
        wallet_address,
        email
      );
      const device_found = user.owned_device_configurations.includes(
        device_id,
        0
      );
      if (device_found) {
        const device: DeviceConfigurationModelInterface =
          await this.deviceService.getDeviceById(device_id);
        const asset_references: Array<DigitalAssetModelReferenceInterface> =
          device.displayable_assets.asset_list;
        const d_date = date.format(new Date(), "YYYY/MM/DD HH:mm:ss");
        return {
          device_found,
          device_id,
          server_version,
          wallet_address,
          download_date: d_date,
          number_of_assets_on_device: asset_references.length,
          asset_references,
        };
      } else {
        throw new Error(
          `Failed to render oriel_config.json. Device with device_id: ${device_id} not found`
        );
      }
    } catch (e) {
      return Promise.reject(new OrielMainServiceException(e.message));
    }
  }

  /**
   * Render Live Asset
   * -----------------
   * Creates a live digital asset to serve to a
   * users device. The method verifies ownership
   * of the asset and then converts it for download.
   *
   * @param {string} wallet_address
   * @param {string} device_id
   * @param {string} asset_contract_address
   * @param {string} asset_token_id
   */
  async renderLiveAsset(
    wallet_address: string,
    device_id: string,
    asset_contract_address: string,
    asset_token_id: string
  ) {
    try {
      const device_config: DeviceConfigurationModelInterface =
        await this.deviceService.getDeviceById(device_id);
      const digital_asset: DigitalAssetModelInterface =
        await this.assetService.verifyAndGetDigitalAsset(
          wallet_address,
          asset_contract_address,
          asset_token_id
        );
      const live_asset_buffer: Buffer =
        await this.liveAssetDownloader.downloadImageToBuffer(
          digital_asset.asset_image_urls.image_original_url
        );
      const device_spec_live_asset_buffer =
        await this.imageConverter.convertImageFromBuffer(
          device_config,
          live_asset_buffer
        );
      return {
        content_type: device_config.display_hardware_details.static_image_format,
        content_length: device_spec_live_asset_buffer.length,
        device_spec_live_asset_buffer,
      };
    } catch (e) {
      return Promise.reject(e);
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
