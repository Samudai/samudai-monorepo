import mongoose from 'mongoose';
const { Schema } = mongoose;

interface IModel {
    member_id: string;
    dao_id: string;
    type_of_member: string;
    date: any;
}

const adminSchema = new Schema<IModel>(
    {
        member_id : { type : String , required : true},
        dao_id : { type : String , required : true},
        type_of_member : { type : String , required : true},
        date : { type: Date, required: true }
    }
)

const AdminSchema = mongoose.model('Dao-Admins', adminSchema);

export { AdminSchema }