
import React,{useEffect, useState} from "react";
import axios from 'axios';

type IdentitasType = {
  id: string;
  name: string;
  value: string;
};
export default function StrukturOrganisasi() {
   const [identitas, setIdentitas] = useState<IdentitasType[] | null>([])

  const handleGetIdentitas = async () => {
    try {
      const result = await axios.get("/api/identitas");
      setIdentitas(result.data);
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(() => {
    handleGetIdentitas();
  }, [])
  
  return (
    <div>
      {/* jumbotron */}
      <div className="relative h-80 md:h-96 lg:h-[35rem]">
        <img src="/img/banner-ft.png" alt="" className="w-full bg-cover h-full" />
       <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-10 -mt-9 md:-mt-20 lg:-mt-36 ">
          <h1 className="bg-gradient-to-r from-blue-700 to-purple-800 text-transparent bg-clip-text w-fit text-3xl md:text-5xl lg:text-6xl font-bold">
            Struktur Organisasi
          </h1>
          <h2 className="text-blue-700 mt-3">
            Struktur Organisasi {identitas?.find((item) => item.name === "Nama Fakultas")?.value} Universitas Bumigora
          </h2>
        </div>
      </div>
 <div className="text-blue-700 text-center mt-10 ">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">
          Struktur Organisasi
        </h1>
    
      </div>
      {/* Main */}
      <main className="flex flex-col items-center pb-10 min-h-64 mt-10">
    
      <img src={identitas?.find((item) => item.name === "Struktur Organisasi")?.value || ""} alt="Struktur Organisasi" width={1000} height={1000} />
      </main>
    </div>
  );
}
