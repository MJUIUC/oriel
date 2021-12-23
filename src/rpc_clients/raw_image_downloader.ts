import axios from "axios";

export default class RawImageDownloader {

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
      const image_string = result.data;
      if (typeof image_string === "string") {
        const raw_image_buf = Buffer.from(image_string, "base64");
        return raw_image_buf;
      } else {
        throw new RawImageDownloaderException("image_string did not pass type check");
      }
    } catch (e) {
      console.debug(e);
    }
  }
}

export class RawImageDownloaderException extends Error {
  constructor(message: string, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RawImageDownloaderException);
    }

    this.name = "RawImageDownloaderException";
    this.message = message;
  }
}
