import User from "../models/User.models.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: "Server error",
        })
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN }
        );

        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
        );

        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        const refreshTokenExpiresAt = new Date(
            Date.now() +
            Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE)
        );

        user.refreshTokenHash = refreshTokenHash;
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;

        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE)
        });

        res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const refreshAccessToken = async (req, res) => {
    try {

        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token missing"
            });
        }

        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshTokenHash) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        if (!user.refreshTokenExpiresAt || (user.refreshTokenExpiresAt < new Date())) {
            return res.status(401).json({
                message: "Refresh token expired"
            });
        }

        const isRefreshTokenValid = await bcrypt.compare(
            refreshToken,
            user.refreshTokenHash
        );

        if (!isRefreshTokenValid) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
            }
        );

        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
        );

        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);

        user.refreshTokenHash = newRefreshTokenHash;

        user.refreshTokenExpiresAt = new Date(
            Date.now() +
            Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE)
        );

        await user.save();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE)
        });

        res.status(200).json({
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(401).json({
            message: "Invalid or expired refresh token"
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (refreshToken) {
            try {
                const decoded = jwt.verify(
                    refreshToken,
                    process.env.JWT_REFRESH_SECRET
                );

                const user = await User.findById(decoded.userId);

                if (user) {
                    user.refreshTokenHash = null;
                    user.refreshTokenExpiresAt = null;

                    await user.save();

                    console.log("Refresh token invalidated");
                } else {
                    console.log("User not found during logout");
                }

            } catch (error) {
                console.log("Refresh token invalid or expired during logout:", error.message);
            }
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        });

        console.log("Refresh token cookie cleared");

        res.status(200).json({
            message: "Logged out successfully"
        });

    } catch (error) {
        console.error("Logout error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};
export default registerUser;
export { loginUser, refreshAccessToken, logoutUser }