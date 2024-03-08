import { Schema,model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new Schema({
    fullName:{
        type: 'String',
        required: [true,'Name is Required'],
        minLength:[5, 'Name must be atleast 5 characters'],
        maxLength:[50, 'Name should be less than 50 characters'],
        lowercase: true,
        trim: true
    },
    email:{
        type: 'String',
        required: [true,'Name is Required'],
        lowercase: true,
        trim: true,
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please fill in a valid email address',
          ], // Matches email against regex
    },
    password:{
        type: 'String',
        required: [true,'Name is Required'],
        minLength:[8, 'Name must be atleast 5 characters'],
        maxLength:[50, 'Name should be less than 50 characters'],
        select: false
    },
    avatar:{
        public_id:{
            type: 'String'
        },
        secure_url:{
            type:'String'
        }
    },
    role:{
        type: 'String',
        enum: ['USER', 'ADMIN'],
        default: 'USER'
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
},{
    timestamps: true
});

userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
})

userSchema.method = {
    generateJWTToken: async function() {
        return await jwt.sign(
            { id: this._id, email:this.email, subscription: this.subscription, role: this.role},
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY,
            }
        )
    },

    comparePassword: async function(plainTextPassword) {
        return await bcrypt.compare(plainTextPassword, this.password);
    }
}

const User = model('User', userSchema);

export default User;