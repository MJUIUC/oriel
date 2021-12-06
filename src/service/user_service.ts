import UserModel from "../db_models/user_model_schema";

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
   * given a users wallet_address. Returns nothing if 
   * a user already exists.
   * 
   * @param {String} wallet_address
   * 
   * @return {UserModel}
  */
  async createNewUser(wallet_address: string, email?: string){
    try {
      const u: typeof UserModel = await UserModel.findOne({ wallet_address }).exec();
      if (u) {
        return null;
      } else {
        return await UserModel.create({
          wallet_address
        });
      }
    } catch(e){ console.debug(e) }
  }
}
