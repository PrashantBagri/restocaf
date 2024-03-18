import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import ApiResponse from "../utils/apiResponse.js";
import { uploadOnCloud } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async function (userId) {
  try {
    const user = await User.findById(userId);

    const accessToken = User.generateAccessToken();
    const refreshToken = User.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating Tokens");
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, bio, city, password } =
    req.body;

  //Checking Mandatory Fields

  if (
    [firstName, lastName, username, email, password].some(
      (field) => field?.trim() == ""
    )
  ) {
    throw new ApiError(400, "Empty Fields are not allowed.");
  }

  //check if user Exists

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new ApiError(400, "User already exists.");
  }

  //Uploading Avatar Image
  const avatarLocalPath = req.files?.avatar[0].path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file not available.");
  }

  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  let coverImage;
  // if(coverImage){

  //     const coverImage = await uploadOnCloud(coverImageLocalPath);
  // }

  coverImageLocalPath
    ? (coverImage = await uploadOnCloud(coverImageLocalPath))
    : (coverImage = "");

  const avatar = await uploadOnCloud(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(500, "Error uploading avatar");
  }

  //Verifying Bio

  if (bio?.trim().length === 0) {
    bio = null;
  }
  if (!city.trim().length > 0) {
    city = null;
  }

  const user = await User.create({
    firstName,
    lastName,
    email,
    username: username.toLowerCase(),
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res.status(201).json(new ApiResponse(201, user, "User Created."));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if ([username, password].some((field) => field.trim() === ""))
    throw new ApiError(400, "Incomplete credentials.");

  const user = await User.findOne({ username }).select("-password");

  if (!user) throw new ApiError(400, "User does not exists.");

  //Generating Tokens

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly : true,
    secure : true
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken)
    .cookie("refreshToken", refreshToken)
    .json(new ApiResponse(200, { accessToken, refreshToken, user }));
});

const logoutUser = asyncHandler(async (req, res)=>{
    const user = req.user;

    const currentUser = User.findByIdAndUpdate(user._id, {
        $unset : {
            refreshToken : 1
        }
    },
    {
        new : true
    }
    )

    const options = {
        httpOnly : true,
        secure : true
    }

    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(
        new ApiResponse(200, {} ,"User Logged out successfully")
    )
})


export { registerUser, loginUser, logoutUser };
