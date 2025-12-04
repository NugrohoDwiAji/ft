import AuthLayout from "@/components/layouts/AuthLayout";
import { useState } from "react";
import React from "react";
import { Lock, User } from "lucide-react";
import ButtonPrimary from "@/components/elements/ButtonPrimary";
import { useIsDesktop } from "@/components/customhooks/hook";
import axios from "@/components/customhooks/axios";
import { CircleAlert } from 'lucide-react';

type DataLogin = {
  username: string;
  password: string; 
}


export default function Login() {
  const [kredensil, setKredensial] = useState<DataLogin>({
    username: "",
    password: "",
  })
  const [isLogin, setIsLogin] = useState(false)


const handleLogin = async() => {
  try {
    const response = await axios.post('/login', kredensil);

      window.location.href = '/admin/dashboard';
   
  
  } catch (error) {
    console.log(error)
    setIsLogin(true)
  }

}



  const isDesktop = useIsDesktop();
  return isDesktop ? (
    <div className="h-screen w-screen bg-radial-[at_50%_25%] from-blue-500 to-blue-800 to-75% flex justify-center items-center">
      
      <AuthLayout title="Login">
        <form action="" className="flex flex-col gap-3 mt-7 ">
          <div className="flex items-center bg-gray-300 rounded-lg px-3 border-2 border-blue-400">
            <label htmlFor="email">
              <User />
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className=" bg-gray-300 w-full  h-12  outline-none px-3"
              placeholder="Username"
              onChange={(e) => setKredensial({...kredensil, username: e.target.value})}
            />
          </div>
          <div className="flex items-center bg-gray-300 rounded-lg px-3  border-2 border-blue-400">
            <label htmlFor="password">
              <Lock />
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className=" bg-gray-300 w-full  h-12 active:outline-none focus:outline-none px-3 "
              placeholder="Password"
              onChange={(e) => setKredensial({...kredensil, password: e.target.value})}
            />
          </div>
        </form>
        {isLogin && <h1 className="text-red-600 text-sm flex gap-1 items-center"><CircleAlert />Credensial Salah</h1>}
          <ButtonPrimary
            ClassName="w-full bg-blue-700 py-3 text-white mt-10"
            onClick={() => handleLogin()}
          >
            Login
          </ButtonPrimary>
      </AuthLayout>
    </div>
  ) : (
    <div className="h-screen w-screen flex justify-center items-center">
      <h1>Silahkan Menggunakan Device Desktop</h1>
    </div>
  );
}
