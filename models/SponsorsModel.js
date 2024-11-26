import mongoose from "mongoose";

const sponsorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
});

const SporsorsModel = mongoose.model("SponsorsModel", sponsorSchema);
export default SporsorsModel;
