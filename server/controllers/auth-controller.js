const auth = require('../auth')
const User = require('../models/user-model')
const bcrypt = require('bcryptjs')

getLoggedIn = async (req, res) => {
    try {
        let userId = auth.verifyUser(req);
        if (!userId) {
            return res.status(200).json({
                loggedIn: false,
                user: null,
                errorMessage: "?"
            })
        }

        const loggedInUser = await User.findOne({ _id: userId });

        return res.status(200).json({
            loggedIn: true,
            user: {
                userName: loggedInUser.userName,
                firstName: loggedInUser.firstName,
                lastName: loggedInUser.lastName,
                email: loggedInUser.email
            }
        })
    } catch (err) {
        res.json(false);
    }
}

loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }

        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        const passwordCorrect = await bcrypt.compare(password, existingUser.passwordHash);
        if (!passwordCorrect) {
            return res
                .status(401)
                .json({
                    errorMessage: "Wrong email or password provided."
                })
        }

        // LOGIN THE USER
        const token = auth.signToken(existingUser._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: true
        }).status(200).json({
            success: true,
            user: {
                userName: existingUser.userName,
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,  
                email: existingUser.email              
            }
        })

    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

logoutUser = async (req, res) => {
    res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send();
}

registerUser = async (req, res) => {
    try {
        const { userName, firstName, lastName, email, password, passwordVerify } = req.body;
        if (!userName || !firstName || !lastName || !email || !password || !passwordVerify) {
            return res
                .status(400)
                .json({ errorMessage: "Please enter all required fields." });
        }
        if (password.length < 8) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter a password of at least 8 characters."
                });
        }
        if (password !== passwordVerify) {
            return res
                .status(400)
                .json({
                    errorMessage: "Please enter the same password twice."
                })
        }
        const existingUsername = await User.findOne({ userName: userName });
        if (existingUsername) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this username already exists."
                })
        }
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    success: false,
                    errorMessage: "An account with this email address already exists."
                })
        }

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({userName, firstName, lastName, email, passwordHash});
        const savedUser = await newUser.save();

        // LOGIN THE USER
        const token = auth.signToken(savedUser._id);
        await res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        }).status(200).json({
            success: true,
            user: {
                userName: savedUser.userName,
                firstName: savedUser.firstName,
                lastName: savedUser.lastName,  
                email: savedUser.email              
            }
        })


    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
}

module.exports = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}