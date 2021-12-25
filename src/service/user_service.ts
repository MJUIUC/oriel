import { DeviceConfigurationModelInterface } from "../db_models/device_configuration_model_schema";
import UserModel, { UserModelInterface } from "../db_models/user_model_schema";

/**
 * User Service
 * ------------
 * Class containing methods to perform actions around
 * users. Actions being mainly CRUD in nature.
 */
export default class UserService {
  /**
   * Create New User
   * -------------------
   * This function will create a new User Model object,
   * then returns it to the function caller. If the
   * User object already exists, return what we find.
   *
   * @param {String} wallet_address
   * @param {String} email?
   *
   * @return {UserModel}
   */
  async createNewUser(wallet_address: string, email?: string) {
    try {
      const u_r: UserModelInterface = await UserModel.findOne({
        wallet_address,
        email
      });
      if (u_r) {
        return u_r;
      } else {
        return await UserModel.create({
          wallet_address,
          email,
        });
      }
    } catch (e) {
      return Promise.reject(new UserServiceException(e.message));
    }
  }

  /**
   * Add Device To Users Owned Device Configurations
   * ----------------------------------------
   * Add to a users owned device configuration collection.
   * The device name must be unique.
   */
  async addToUsersOwnedDeviceConfigurations(
    wallet_address: string,
    device_config: DeviceConfigurationModelInterface,
  ) {
    try {
      const u: UserModelInterface = await this.findOneExistingUser(wallet_address);
      const found_device_config_id = u.owned_device_configurations.includes(device_config._id, 0);
      if (!found_device_config_id) { // if the device config doesn't exist
        u.owned_device_configurations.push(device_config._id);
        u.save();
      }
    } catch (e) {
      return new UserServiceException(e.message);
    }
  }

  async getOrielUser(wallet_address: string, email?: string){
    try {
      return await this.findOneExistingUser(wallet_address, email);
    } catch(e){return new UserServiceException(e.message);}
  }

  /* PRIVATE METHODS */

  private async findOneExistingUser(wallet_address: string, email?: string) {
    try {
      const u: any = await UserModel.findOne({
        wallet_address,
        email_address: email,
      }).exec();
      if (u) {
        return u;
      } else {
        throw new UserServiceException(
          `Failed to find user for wallet_address: ${wallet_address}`
        );
      }
    } catch (e) {
      return new UserServiceException(e.message);
    }
  }
}

export class UserServiceException extends Error {
  constructor(message: string, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, UserServiceException);
    }

    this.name = "UserServiceException";
    this.message = message;
  }
}
