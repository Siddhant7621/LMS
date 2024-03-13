import { type } from "express/lib/response";
import { model, Schema } from "mongoose";

const courseSchema = new Schema({
    title:{
        type:String,
        required: [true, 'Title is required'],
        minlength: [8, 'Title must be atleast 8 characters'],
        maxlength: [50, 'Title cannot be more than 50 characters'],
        trim: true,
    },
    description:{
        type:String,
        required: [true, 'Description is required'],
        minlength: [20, 'Description must be atleast 20 characters long'],
    },
    category:{
        type: String,
        required: [true, 'Category is required'],
    },
    thumbnail:{
        public_id:{
            type:String,
            required: true,
        },
        secure_url:{
            type:String,
            required: true,
        }
    },
    lectures:[
        {
            title:String,
            description: String,
            lecture :{
                public_id:{
                    type:String,
                    required: true,
                },
                secure_url:{
                    type:String,
                    required: true,
                }
            }
        }
    ],
    numbersOfLectures:{
        type:Number,
        default: 0,
    },
    cretedBy:{
        type:String,
        required: [true, 'Course instructor name is required'],
    }

}, {
    timestamps:true
});

const Course = model('Course', courseSchema);

export default Course;

