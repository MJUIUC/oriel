import UserModel from "../db_models/user_model_schema";
import { OpenSeaDigitalAsset } from "../rpc_clients/open_sea_client";

/**
 * User Service
 * ------------
 * Class containing methods to perform actions around
 * users.
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
  async createNewUser(wallet_address: string, email?: string){
    try {
      const u_r: typeof UserModel = await this.findOneUser(wallet_address, email);
      if (u_r) {
        return u_r;
      } else {
        return await UserModel.create({
          wallet_address,
          email,
        });
      }
    } catch(e){ console.debug(e) }
  }

  /**
   * Add To Users Owned Device Configurations
   * ----------------------------------------
   * Add to a users owned device configuration collection
  */
  async addToUsersOwnedDeviceConfigurations(){

  }

  /* PRIVATE METHODS */

  private async findOneUser(wallet_address: string, email?: string) {
    try {
      const u: typeof UserModel = await UserModel.findOne({ wallet_address }).exec();
      if (u) {
        return u;
      } else {
        return null;
      }
    } catch(e){ console.debug(e) }
  }
}
