const express = require("express");
const userRouter = express.Router();
const {
    handelActivateUsersAccount,
    handelProcessRegister,
    handelGetUsers,
    handelGetUserById,
    handelDeleteUserByID,
    handelUpdateUserByID,
    handelManageUserBanAndUnBanById,
    handelUpdatePassword,
    handelForgetPassword,
    handelResetPassword,
} = require("../controllers/userControllers");

const userImageUpload = require("../middlewares/uploadFile");
const { validatorUserRegistration, validatorUserUpdatePassword, validatorUserForgetPassword, validatorUserResetPassword } = require("../validators/auth");
const runValidation = require("../validators");
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth");

// !Get, Post, Put, Delete all user router
userRouter.post("/process-register",
    userImageUpload.single("image"),
    isLoggedOut,
    validatorUserRegistration,
    runValidation,
    handelProcessRegister);

userRouter.post("/activate", isLoggedOut, handelActivateUsersAccount);
userRouter.get("/", isLoggedIn, isAdmin, handelGetUsers);
userRouter.get("/:id([0-9a-fA-F]{24})", isLoggedIn, handelGetUserById);

userRouter.delete("/:id([0-9a-fA-F]{24})", isLoggedIn, handelDeleteUserByID);


userRouter.put("/reset-password",
    validatorUserResetPassword,
    runValidation,
    isLoggedIn,
    handelResetPassword
);

userRouter.put("/:id([0-9a-fA-F]{24})",
    userImageUpload.single("image"),
    handelUpdateUserByID
);
userRouter.put("/manage-user/:id([0-9a-fA-F]{24})",
    isLoggedIn,
    isAdmin,
    handelManageUserBanAndUnBanById
);
userRouter.put("/update-password/:id([0-9a-fA-F]{24})",
    validatorUserUpdatePassword,
    runValidation,
    isLoggedIn,
    handelUpdatePassword
);
userRouter.post("/forget-password",
    validatorUserForgetPassword,
    runValidation,
    isLoggedIn,
    handelForgetPassword
);

module.exports = userRouter; 