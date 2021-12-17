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
      console.debug(e);
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
      const u = await this.findOneExistingUser(wallet_address);
      if (this.checkIfDeviceNameUnique(u, device_config)) {
        u.owned_device_configurations.push(device_config);
        u.save();
      }
    } catch (e) {
      console.debug(e);
    }
  }

  /* PRIVATE METHODS */

  private async findOneExistingUser(wallet_address: string, email?: string) {
    try {
      const u: any = await UserModel.findOne({
        wallet_address,
      }).exec();
      if (u) {
        return u;
      } else {
        throw new UserServiceException(
          `Failed to find user for wallet_address: ${wallet_address}`
        );
      }
    } catch (e) {
      console.debug(e);
    }
  }

  private checkIfDeviceNameUnique(
    user: UserModelInterface,
    device_config: DeviceConfigurationModelInterface
  ) {
    return user.owned_device_configurations.every((device: DeviceConfigurationModelInterface) => {
      if (device.device_name != device_config.device_name) {
        return true;
      }
      return false;
    })
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
