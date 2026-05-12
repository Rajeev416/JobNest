import mongoose from "mongoose";


const jobSchema = new mongoose.Schema({
    title: {type:String,required:true},
    description: {type:String,required:true},
    location: {type:String,required:true},
    category: {type:String,required:true},
    level: {type:String,required:true},
    salary: {type:Number,required:true},
    date: {type:Number,required:true},
    visible: {type:Boolean, default: true},
    companyId: {type: mongoose.Schema.Types.ObjectId, ref: "Company", required: true},
    companyWebsite: {type:String, required: false},
    workType: {type: String, required: false, default: "On-site"},
    openings: {type: Number, required: false, default: 1},
    lastDate: {type: String, required: false},

});

const Job = mongoose.model('Job', jobSchema)

export default Job 
