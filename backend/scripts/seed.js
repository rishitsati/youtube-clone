import mongoose from "mongoose";
import Video from "../models/Video.js";
import User from "../models/User.js";
import Channel from "../models/Channel.js";
import { sampleVideos } from "../sampleData.js";

const MONGO_URI = "mongodb+srv://rishitsati:Rishi24@cluster0.7dimcnh.mongodb.net/youtube_clone?retryWrites=true&w=majority";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB");

    await Video.deleteMany({});
    await User.deleteMany({});
    await Channel.deleteMany({});
    console.log("Old data cleared");

    const user = await User.create({
      username: "demoUser",
      email: "demo@youtube.com",
      password: "123456",
    });

    console.log("Dummy user created");

    const channel = await Channel.create({
      channelName: "Demo Channel",
      description: "Sample channel for testing",
      owner: user._id,
    });

    console.log("Dummy channel created");

    const videos = sampleVideos.map((v) => ({
      ...v,
      uploader: user._id,
      channel: channel._id,
    }));

    await Video.insertMany(videos);

    console.log("🔥 All sample videos inserted successfully!");
    process.exit();

  } catch (err) {
    console.log(err);
    process.exit(1);
  }
}

seed();
