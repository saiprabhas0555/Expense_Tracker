import {useState} from "react";
import {motion} from "framer-motion";
import {useAuth} from "../context/AuthContext";
import {useNavigate} from "react-router-dom";
  import { ToastContainer, toast } from 'react-toastify';


const API_URL = import.meta.env.VITE_BACKEND_URL;

export const Login = () => {
    const [signUp, setSignUp] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    const {login} = useAuth();  
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = signUp ? `${API_URL}/signup` : `${API_URL}/login`;
        // console.log(url);
        try {
            setLoading(true);
            const response = await fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, email, password}),
            });
            if (!response.ok) {
                // console.log(await response.text())
                setError(await response.text());
                toast.error("Authentication failed. Please check your credentials.");
                throw new Error(`HTTP error!`);
            }
            setLoading(false);
            const data = await response.json(); // Parse JSON response
            console.log(data)
            if(signUp) {
                if (data.error) {
                    setError(data.error);
                    toast.error("Sign up failed. Please try again.");
                } else {
                    toast.success("Sign up successful! You can now log in.");
                }
                setSignUp(false)
                return
            }
            if (data.accessToken) {
                login(data.accessToken);
                toast.success("Login successful!");
                setTimeout(() => {
                  
                    navigate("/dashboard");
                },1000);
            } else {
                // console.error("Token not received!");
                toast.error("Login failed. Please try again.");

            }
        } catch (error) {
            toast.error("An error occurred during authentication. Please try again.");
        }
    };


    return (
        <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
            <motion.div
                initial={{opacity: 0, scale: 0.9}}
                animate={{opacity: 1, scale: 1}}
                transition={{duration: 0.5}}
                className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-6"
            >
                <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    {signUp ? "Create Account" : "Welcome Back"}
                </h1>
                {error!=""?
                    <p className="text-red-600">{error}</p>
                    :
                    <></>
                }
                <br/>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    {signUp && (
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value); setError("")
                            }}
                            placeholder="Username"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value); setError("")
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value); setError("")
                        }}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        className="cursor-pointer w-full p-2 mt-4 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition"
                        disabled={loading}
                    >
                        { loading? (signUp ? "Signing up..." : "Logging in...") :  (  signUp ? "Sign Up" : "Login")}
                    </button>
                </form>
                <div
                    className="text-sm text-gray-600 mt-4 text-center cursor-pointer hover:text-blue-500"
                    onClick={() =>
                        setSignUp(!signUp)
                    }
                >
                    {signUp ? "Already have an account? Login" : "New User? Sign Up"}
                </div>
            </motion.div>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
            />
        </div>
    );
};