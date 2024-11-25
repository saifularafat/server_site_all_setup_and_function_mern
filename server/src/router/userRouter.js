const express = require("express");
const userRouter = express.Router();
const {
    getUsers,
    deleteUserByID,
    getUserById,
    processRegister,
    activateUsersAccount,
    updateUserByID,
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
    processRegister);

userRouter.post("/activate", isLoggedOut, activateUsersAccount);
userRouter.get("/", isLoggedIn, isAdmin, getUsers);
userRouter.get("/:id", isLoggedIn, getUserById);

userRouter.delete("/:id", isLoggedIn, deleteUserByID);


userRouter.put("/reset-password",
    validatorUserResetPassword,
    runValidation,
    isLoggedIn,
    handelResetPassword
);

userRouter.put("/:id", userImageUpload.single("image"), updateUserByID);
userRouter.put("/manage-user/:id",
    isLoggedIn,
    isAdmin,
    handelManageUserBanAndUnBanById
);
userRouter.put("/update-password/:id",
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