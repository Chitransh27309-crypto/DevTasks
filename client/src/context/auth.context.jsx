import { createContext, useContext, useEffect, useState, useRef } from "react";
import { refreshAccessToken, logoutUser as logoutUserApi } from "../services/auth.service.js";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const restoreAttempted = useRef(false);

    useEffect(() => {
        if (restoreAttempted.current) {
            return;
        }

        restoreAttempted.current = true;

        const restoreSession = async () => {
            try {
                console.log("Restoring session...");
                const data = await refreshAccessToken();
                console.log("Session restored ");
                setAccessToken(data.accessToken);
                setUser(data.user);
            } catch (error) {
                console.log("No active session:", error.message);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        const refreshInterval = Number(
            import.meta.env.VITE_ACCESS_TOKEN_REFRESH_INTERVAL
        );

        const timer = setTimeout(async () => {
            try {
                console.log("Refreshing access token...");

                const data = await refreshAccessToken();

                setAccessToken(data.accessToken);
                setUser(data.user);

                console.log("Access token refreshed");

            } catch (error) {
                console.error(
                    "Failed to refresh access token:",
                    error.message
                );

                setUser(null);
                setAccessToken(null);
            }
        }, refreshInterval);

        return () => {
            clearTimeout(timer);
        };
    }, [accessToken]);

    const logoutUser = async () => {
        try {
            await logoutUserApi();
        } catch (error) {
            console.error("Logout error:", error.message);
        } finally {
            setUser(null);
            setAccessToken(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                accessToken,
                setAccessToken,
                loading,
                logoutUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};