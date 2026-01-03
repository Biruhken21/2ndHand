// models/Ad.js
const mongoose = require("mongoose");

const adsSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    adTitle: {
      type: String,
      required: [true, "Ad title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 2000,
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
    },
    image: {
      type: String, // store the Cloudinary URL or local path
      required: [true, "Image is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ads", adsSchema);
