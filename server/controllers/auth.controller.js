import User from "../models/User.models.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
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

        // 1. Check fields
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 2. Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 3. Compare password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. Create access token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
            }
        );

        // 5. Create refresh token
        const refreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
        );

        // 6. Hash refresh token before storing it
        const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

        // 7. Calculate refresh token expiry
        const refreshTokenExpiresAt = new Date(
            Date.now() +
            Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE)
        );

        // 8. Store refresh token hash + expiry in database
        user.refreshTokenHash = refreshTokenHash;
        user.refreshTokenExpiresAt = refreshTokenExpiresAt;

        await user.save();

        // 9. Send refresh token as HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE)
        });

        // 10. Send access token
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
        // 1. Get refresh token from cookie
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                message: "Refresh token missing"
            });
        }

        // 2. Verify refresh token JWT
        const decoded = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET
        );

        // 3. Find the user
        const user = await User.findById(decoded.userId);

        if (!user || !user.refreshTokenHash) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        // 4. Check whether refresh token has expired
        if (
            !user.refreshTokenExpiresAt ||
            user.refreshTokenExpiresAt < new Date()
        ) {
            return res.status(401).json({
                message: "Refresh token expired"
            });
        }

        // 5. Compare cookie token with stored hash
        const isRefreshTokenValid = await bcrypt.compare(
            refreshToken,
            user.refreshTokenHash
        );

        if (!isRefreshTokenValid) {
            return res.status(401).json({
                message: "Invalid refresh token"
            });
        }

        // 6. Create new access token
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN
            }
        );

        // 7. Create new refresh token
        const newRefreshToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN
            }
        );

        // 8. Hash the new refresh token
        const newRefreshTokenHash = await bcrypt.hash(
            newRefreshToken,
            10
        );

        // 9. Save the new refresh-token state
        user.refreshTokenHash = newRefreshTokenHash;

        user.refreshTokenExpiresAt = new Date(
            Date.now() +
            Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE)
        );

        await user.save();

        // 10. Replace old cookie with new refresh token
        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE)
        });

        // 11. Send new access token
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

        // If a refresh token exists, invalidate it server-side
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

                    console.log("Refresh token invalidated ✅");
                } else {
                    console.log("User not found during logout");
                }

            } catch (error) {
                console.log("Refresh token invalid or expired during logout:", error.message);
            }
        }

        // Clear browser cookie
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        console.log("Refresh token cookie cleared ✅");

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