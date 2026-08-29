import { useState } from "react";
import { loginUser } from "../services/auth.service.js";
import { useAuth } from "../context/auth.context.jsx";
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const { setUser, setAccessToken } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = await loginUser({
                email: formData.email,
                password: formData.password
            });

            console.log("Login successful:", data);

            setUser(data.user);
            setAccessToken(data.accessToken);

            navigate("/dashboard");

        } catch (error) {
            console.error("Login error:", error.message);
            alert(error.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">

                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Welcome Back
                </h1>

                <p className="mb-6 text-gray-500">
                    Login to your DevTask account
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your Password"
                            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700"
                    >
                        Login
                    </button>

                </form>
                <p className="mt-5 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-blue-600 hover:text-blue-700"
                    >
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;