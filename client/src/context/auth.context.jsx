import { createContext, useContext, useEffect, useState } from "react";
import { refreshAccessToken } from "../services/auth.service.js";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const restoreSession = async () => {
            try {
                const data = await refreshAccessToken();
                setAccessToken(data.accessToken);
                setUser(data.user);
            } catch (error) {
                console.log("No active session");
            } finally {
                setLoading(false);
            }
        };
        restoreSession();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                accessToken,
                setAccessToken,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};