import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: true
}

const register = async (req, res, next) =>{
    const {fullname, email, password} = req.body;

    if(!fullname || !email || !password){
        return next(new AppError('All fields are required', 400));
    }

    const userExists = await User.findOne({email})

    if(userExists){
        return next(new AppError('Email already exits', 400));
    }

    const user = User.create({
        fullname,
        email,
        password,
        avatar: {
            public_id: email,
            secure_url
        }
    });

    if(!user){
        return next(new AppError('User registration failed, please try again', 400))
    }

    //Todo file upload

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

export {
    register,
    login,
    logout,
    getProfile
}

