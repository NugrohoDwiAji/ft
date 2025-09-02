import React, { use } from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import CardPengumuman from "@/components/cards/CardPengumuman";

type PengumumanType = {
  id: string;
  title: string;
  file_path: string;
  uploadat: string;
};

export default function Pengumuman() {
  const [dataPengumuman, setDataPengumuman] = useState<PengumumanType[]>([]);

  const handleGetPengumuman = async () => {
    try {
      const result = await axios.get("/api/pengumuman");
      setDataPengumuman(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetPengumuman();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative h-80 md:h-96 lg:h-[43rem]">
        <img
          src="/img/banner-ft.png"
          alt=""
          className="w-full bg-cover h-full"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0  flex flex-col justify-center p-10 ">
          <h1 className="text-transparent lg:h-20 w-fit text-3xl md:text-4xl lg:text-6xl font-bold  bg-gradient-to-r from-blue-400 to-purple-900 bg-clip-text">
            Pengumuman
          </h1>
          <h2 className="text-gray-700 mt-3">Pengumuman Fakultas Teknik</h2>
        </div>
      </div>

      {/* Main */}
      <main>
        <h1 className="font-bold text-xl md:text-2xl my-5 text-center text-blue-700">
          Pengumuman
        </h1>
        <div className="flex flex-wrap justify-center gap-5 items-center mb-5">
          {dataPengumuman.map((item, index) => (
            <CardPengumuman
              key={index}
              file_path={item.file_path}
              title={item.title}
              uploadat={item.uploadat}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
