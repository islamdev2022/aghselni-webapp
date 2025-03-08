import { useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(email, password);
  };
  console.log(email, password);
  return (
    <div className="flex flex-col items-center justify-center h-screen">

    <div className="max-w-md relative flex flex-col p-8 text-black border border-gray-200 shadow-2xl rounded-xl">
      <div className="text-2xl font-bold mb-2 text-[#1e0e4b] text-center">
        Welcome back to <span className="text-cyan-600">Aghselni</span>
      </div>
      <div className="text-sm font-normal mb-4 text-center text-[#1e0e4b]">
        Log in to your account
      </div>
      <form className="flex flex-col gap-3">
        <div className="block relative">
          <label
            htmlFor="email"
            className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
          >
            Email
          </label>
          <input
          onChange={(e) => setEmail(e.target.value)}
            type="text"
            id="email"
            className="rounded border border-gray-200 text-sm w-full font-normal text-black  appearance-none  h-11  ring-cyan-600 outline-cyan-600 "
          />
        </div>
        <div className="block relative">
          <label
            htmlFor="password"
            className="block text-gray-600 cursor-text text-sm leading-[140%] font-normal mb-2"
          >
            Password
          </label>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="text"
            id="password"
            className="rounded border border-gray-200 text-sm w-full font-normal text-black  appearance-none  h-11  ring-cyan-600 outline-cyan-600 "
          />
        </div>
        <Button
          type="submit"
          className="bg-cyan-600 hover:bg-cyan-700 w-max m-auto cursor-pointer rounded text-white text-sm font-normal"
            onClick={handleSubmit}
        >
          Submit
        </Button>
      </form>
      <div className="text-sm text-center mt-[1.6rem]">
        Don&apos;t have an account yet?{" "}
        <Link to="/signup" className="text-sm text-cyan-600">
          Sign up for free!
        </Link>
      </div>
    </div>
    </div>

  );
};
export default Login;
