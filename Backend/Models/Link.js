import mongoose from "mongoose";
const LinkSchema=new mongoose.Schema({
    code:{type:String,required:true,index:true},
    targetLink:{type:String,required:true},
    clicks:{type:Number,default:0},
    createdAt: {type: Date,default: () => new Date()},
    lastClickedAt: {type: Date}
})

export default mongoose.model("Link", LinkSchema);
