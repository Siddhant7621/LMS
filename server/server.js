
import app from "./app.js";
import connectionToDB from "./confg/dbConnection.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const PORT = process.env.PORT || 5000;

//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})



app.listen(PORT , async () => {
    await connectionToDB();
    console.log(`App is running at localhost:${PORT}`);
});