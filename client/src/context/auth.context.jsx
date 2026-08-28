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