import axios from "axios";

export default class LiveAssetDownloader {

  /**
   * Download Image To Buffer
   * ------------------------
   * This will download an image from a url and
   * convert it to an in-memory buffer.
   * 
   * @param {string} image_url: url of the raw hosted image file.
   * 
  */
  async downloadImageToBuffer(image_url: string){
    try {
      const result = await axios.get(image_url, {responseType: 'arraybuffer'});
      const image_array_buffer: any = result.data;
      
      if (image_array_buffer.length !== 0) {
        return image_array_buffer;
      } else {
        throw new Error("image_array_buffer length empty");
      }
    } catch (e) {
      return Promise.reject(new LiveAssetDownloaderException(e.message));
    }
  }
}

export class LiveAssetDownloaderException extends Error {
  constructor(message: string, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, LiveAssetDownloaderException);
    }

    this.name = "LiveAssetDownloaderException";
    this.message = message;
  }
}
