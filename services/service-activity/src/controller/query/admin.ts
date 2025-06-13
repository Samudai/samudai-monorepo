import { AdminSchema } from "../../models/AdminsSchema";
import { Admin } from '../../utils/types';

export class AdminQuery {

    addAdmin = async (admin: Admin) => {
        try {
          const newAdmin = await AdminSchema.create(admin);
        } catch (err: any) {
          console.log(err);
        }
      };

}