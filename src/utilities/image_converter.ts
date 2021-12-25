import * as sharp from "sharp";
import { DeviceConfigurationModelInterface } from "../db_models/device_configuration_model_schema";

export default class ImageConverter {
  /**
   * Convert Image From Buffer
   * -------------------------
   * Converts an image from a buffer into a format
   * following specifications from a device configuration
   * object.
   * 
   * TODO: Add logging for conversion time
   *
   * @param {DeviceConfigurationModelInterface} device_config
   *
   */
  async convertImageFromBuffer(
    device_config: DeviceConfigurationModelInterface,
    image_buffer: Buffer
  ) {
    try {
      let retries = 3; // should move these somewhere smarter
      while (true) {
        let LIVE_IMAGE = await sharp(image_buffer)
          .resize({
            width: device_config.display_hardware_details.screen_width,
            height: device_config.display_hardware_details.screen_height,
            fit: "contain",
          })
          .jpeg({
            quality: 100,
            chromaSubsampling: "4:4:4",
          })
          .toBuffer();
          if (LIVE_IMAGE) {
            return LIVE_IMAGE;
          } else {
            if (retries === 0) throw new Error("Out of retires");
            retries --;
          }
          
      }
    } catch (e) {
      return Promise.reject(new ImageConverterException(e.message));
    }
  }
}

export class ImageConverterException extends Error {
  constructor(message: string, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ImageConverterException);
    }
    
    this.name = "ImageConverterException";
    this.message = message;
  }
}
