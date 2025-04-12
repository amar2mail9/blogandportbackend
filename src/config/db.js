import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
      console.log("DataBase Connected");
    });
  } catch (error) {
    console.log(`DB COnnection Error `, error);
  }
};

export { connectDB };
