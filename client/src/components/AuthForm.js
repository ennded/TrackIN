import { useState } from "react";
import {
  LockClosedIcon,
  UserIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const AuthForm = ({ onAuth, error }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const credentials = isLogin
      ? { email, password }
      : { name, email, password };
    onAuth(credentials, isLogin);
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-xl shadow-sm">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setIsLogin(true)}
          className={`flex-1 py-2 rounded-lg ${
            isLogin ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Login
        </button>
        <button
          onClick={() => setIsLogin(false)}
          className={`flex-1 py-2 rounded-lg ${
            !isLogin ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600"
          }`}
        >
          Register
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div className="relative">
            <UserIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        )}

        <div className="relative">
          <EnvelopeIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div className="relative">
          <LockClosedIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength="6"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition-colors"
        >
          {isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
