import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider === "local";
      },
      minlength: 8,
    },
    passwordChangedAt: {
      type: Date,
      default: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    googleId: {
      type: String,
      default: null,
    },
    githubId: {
      type: String,
      default: null,
    },
    picture: {
      type: String,
      default:
        "https://ik.imagekit.io/anaghroy/Hackathon/profile_pictures/Avatar%20empty.png",
    },
    dob: {
      type: Date,
      default: null,
    },
    bio: {
      type: String,
      trim: true,
      maxlength: 200,
      default: "",
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.password || !this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
