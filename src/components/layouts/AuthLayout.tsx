import React from "react";

type Props = {
    children: React.ReactNode;
    title: string;
};

const AuthLayout = ({ children, title }: Props) => {
  return (
    <div className="h-[33rem] w-[59rem] bg-white shadow-2xl rounded-3xl flex">
      <div className="w-1/2  rounded-l-3xl relative overflow-hidden">
        <div className="h-[35rem] w-[35rem] absolute -left-24 -top-40 rounded-full bg-radial-[at_25%_25%] flex flex-col justify-center items-center from-blue-500 to-blue-800 to-75% text-white ">
          <div>
            <h1 className="text-4xl font-bold">WELCOME</h1>
            <h2 className="text-2xl font-semibold mb-5">Admin Fakultas</h2>
            <p>
              Silahkan Atur Content Web Fakultas Anda <br /> Agar Terlihat Lebih Menarik...!😊
            </p>
          </div>
        </div>
        <div className="h-[15rem] w-[15rem] absolute rounded-full -bottom-5 -left-16 bg-radial-[at_75%_25%] from-blue-500 to-blue-800 to-75%"></div>
        <div className="h-[12rem] w-[12rem] absolute rounded-full bottom-10 right-12 bg-radial-[at_25%_25%] from-blue-500 to-blue-800 to-75%"></div>
      </div>
      <div className="px-5 pt-14">
        <h1 className="text-3xl font-bold mb-2">{title}</h1>
        <p>Silahakan Masukan Kredensial Anda...</p>
       {children}
      </div>
    </div>
  );
};

export default AuthLayout;
