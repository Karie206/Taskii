import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("DB is connected!");
    }
    catch (err) {
        console.error("Error connecting to DB: ", err.message);
    }
};

export default connectDB;
