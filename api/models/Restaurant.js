import mongoose from "mongoose";

const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: [String], required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  photos: { type: [String] },
  desc: { type: String, required: true },
  tables: { type: [String] },
});

export default mongoose.model("Restaurant", RestaurantSchema);
