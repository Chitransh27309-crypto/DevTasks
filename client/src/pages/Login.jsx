function Login() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">

                <h1 className="mb-2 text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="mb-6 text-gray-500">Login to your DevTask account</p>

                <form className="space-y-4">

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
                        <input
                            type="password"
                            placeholder="Enter Your Password"
                            className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
                        />
                    </div>

                    <button type="submit" className="w-full rounded-md bg-blue-600 py-2 font-medium text-white hover:bg-blue-700">Login</button>

                </form>
            </div>
        </div>
    );
}

export default Login;