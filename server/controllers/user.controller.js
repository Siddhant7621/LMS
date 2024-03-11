import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true
}

const register = async (req, res, next) =>{
    const {fullName, email, password} = req.body;

    if(!fullName || !email || !password){
        return next(new AppError('All fields are required', 400));
    }

    const userExists = await User.findOne({email})

    if(userExists){
        return next(new AppError('Email already exits', 400));
    }

    const user = await User.create({
        fullName,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url:'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg'
        }
    });

    if(!user){
        return next(new AppError('User registration failed, please try again', 400))
    }

    //Todo file upload -> done
    console.log('File Details > ', JSON.stringify(req.file));

    if(req.file){

        
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'LMS',
                width: 250,
                height: 250,
                gravity: 'faces',
                crop: 'fill'
            });

            if(result){
                user.avatar.public_id = result.public_id;
                (await user).avatar.secure_url= result.secure_url;

                //remove file from server
                fs.rm(`uploads/${req.file.filename}`)
            }

        } catch (error) {
            return next (new AppError(error || 'File not uploaded successfully, please try again', 500))
        }
    }

    await user.save();

    user.password = undefined;

    const token = await user.generateJWTToken();

    res.cookie('token', token, cookieOptions)

    res.status(201).json({
        success: true,
        message: "User registered successfully",
        user,
    })

    
};

const login = async (req, res) =>{
    try {
        const {email, password} = req.body;
    
        if(!email || !password){
            return next( new AppError( 'All fields are required', 400));
        }
    
        const user = await User.findOne({
            email
        }).select('+password');
    
        if(!user || !user.comparePassword(password)) {
            return next( new AppError( 'Email or Password doest not match', 400));
        }
    
    
    
        const token = await user.generateJWTToken();
        user.password = undefined;
    
        res.cookie('token', token, cookieOptions);
    
        res.status(200).json({
            success:true,
            message: 'User Logged In Successfully',
            user,
        })
    } catch (error) {
        return next( new AppError( error.message, 500));
    }

};

const logout = (req, res) =>{
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'User Logged Out Successfully'
    })

};

const getProfile = async (req, res) =>{

    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
    
        res.status(200).json({
            success: true,
            message: 'User Details',
            user
        })
    } catch (error) {
        return next( new AppError('Failed to fetch profile details',500));
    }

};

const forgotPassword = async () => {
    const {email} = req.body;

    if(!email) {
        return next( new AppError('Email is required',400));
    }

    const user = await User.findOne({email});

    if(!user){
        return next( new AppError('Email not registered',400));
    }

    const resetToken = await user.generatePasswordResetToken();

    await user.save();

    const resetPasswordURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    try{
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset Password token has been sent to ${email} successfully`
        })
    } catch(e) {

        user.forgotPasswordExpiry = undefined;
        user.forgotPasswordToken = undefined;
        await user.save();
        return next(new AppError(e.message,500));
    }


}

const resetPassword = () => {}

export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword
}

