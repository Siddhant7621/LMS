import AppError from "../utils/error.util";

const register = async (req, res, next) =>{
    const {fullname, email, password} = req.body;

    if(!fullname || !email || !password){
        return next(new AppError('All fields are required', 400));
    }

    const userExists = await User.findOne({email})

    if(userExists){
        return next(new AppError('Email already exits', 400));
    }

    const userCreate = 
};

const login = (req, res) =>{

};

const logout = (req, res) =>{

};

const getProfile = (req, res) =>{

};

export {
    register,
    login,
    logout,
    getProfile
}

