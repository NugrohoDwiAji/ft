import CardBerkas from "@/components/cards/CardBerkas";
import React, { useEffect, useState } from "react";
import axios from "axios";

type Berkas = {
  id: string;
  title: string;
  filepath: string;
  uploadat: string;
};

type IdentitasType = {
  id: string;
  name: string;
  value: string;
};

export default function Unduhan() {
  const [berkas, setberkas] = useState<Berkas[]>([]);
  const [identitas, setIdentitas] = useState<IdentitasType[] | null>([]);

  const handleGetIdentitas = async () => {
    try {
      const result = await axios.get("/api/identitas");
      setIdentitas(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetIdentitas();
  }, []);

  const handleBerkas = async () => {
    try {
      const response = await axios.get("/api/berkas");
      setberkas(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleBerkas();
  }, []);

  return (
    <div className="min-h-screen">
      <div className="relative md:h-96 lg:h-[38rem]">
        <img
          src="/img/banner-ft.png"
          alt=""
          className="w-full bg-cover h-full"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-2 md:p-10 -mt-9 md:-mt-20 lg:-mt-36 leading-5">
          <h1 className="bg-gradient-to-r from-blue-700 to-purple-700 text-transparent w-fit bg-clip-text text-3xl md:text-5xl lg:text-6xl font-bold">
            Berkas Unduhan
          </h1>
          <h2 className="text-blue-700 mt-3">
            Berkas Penting{" "}
            {identitas?.find((item) => item.name === "Nama Fakultas")?.value}{" "}
            Universitas Bumigora
          </h2>
        </div>
      </div>

      <div className="text-blue-700 text-center mt-10 ">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">Berkas</h1>
      </div>
      {/* Main */}
      <main className="flex flex-col items-center min-h-64">
        <div className="flex gap-5 flex-wrap justify-start lg:p-10 p-5">
          {berkas.map((item) => (
            <CardBerkas key={item.id} title={item.title} link={item.filepath} />
          ))}
        </div>
      </main>
    </div>
  );
}
