import mongoose from "mongoose";

export async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    mongoose.connection.on("connected", () => {
      console.log("Mongodb connected successfully!");
    });
    mongoose.connection.on("error", (err) => {
      console.log("Mongodb connection error", err);
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong!");
    console.log(`Error: ${error}`);
  }
}
