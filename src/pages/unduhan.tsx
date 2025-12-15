import CardBerkas from "@/components/cards/CardBerkas";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight, ChevronLeft, Download, Eye } from "lucide-react";

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
  const [viewPerPage, setViewPerPage] = useState(5);
  const [itemSearch, setItemSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

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
    if (itemSearch !== "") {
      try {
        const response = await axios.get(`/api/berkasDetails?name=${itemSearch}`);
        setberkas(response.data);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await axios.get("/api/berkas");
        setberkas(response.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // Fungsi untuk membuka viewer di tab baru
  const handleOpenViewer = (berkasId: string) => {
    window.open(`/viewer/${berkasId}`, "_blank");
  };

  // Fungsi untuk download langsung
  const handleDirectDownload = (filepath: string, title: string) => {
    const link = document.createElement("a");
    link.href = filepath;
    link.download = title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // pagination logic
  const totalPages = Math.ceil(berkas.length / viewPerPage);
  const startIndex = (currentPage - 1) * viewPerPage;
  const endIndex = startIndex + viewPerPage;
  const currentData = berkas.slice(startIndex, endIndex);

  useEffect(() => {
    handleBerkas();
  }, [itemSearch]);

  return (
    <div className="min-h-screen">
      <div className="relative h-80 md:h-96 lg:h-[35rem]">
        <img
          src="/img/banner-ft.png"
          alt=""
          className="w-full bg-cover h-full"
        />
        <div className="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center p-3 md:p-10 -mt-9 md:-mt-20 lg:-mt-36">
          <h1 className="bg-gradient-to-r from-blue-700 to bg-purple-800 text-transparent bg-clip-text text-3xl md:text-5xl lg:text-6xl font-bold w-fit">
            Berkas Unduhan
          </h1>
          <h2 className="text-blue-700 mt-3">
            Berkas Penting{" "}
            {identitas?.find((item) => item.name === "Nama Fakultas")?.value}{" "}
            Universitas Bumigora
          </h2>
        </div>
      </div>

      <div className="text-blue-600 text-center mt-10 ">
        <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">Berkas</h1>
      </div>

      {/* Main */}
      <main className="flex flex-col items-center min-h-60 px-2">
        <div className="lg:w-[900px] md:w-[650px] w-80">
          {/* stats */}
          <div className="border border-gray-200 w-full h-fit rounded-lg mb-5 p-2 ">
            <div className="flex gap-5 items-center pb-2">
              {/* search */}
              <input
                type="text"
                onChange={(e) => {
                  handleBerkas();
                  setItemSearch(e.target.value);
                }}
                placeholder="Cari Berkas"
                className="inert:shadow-2xl border border-gray-200 h-10 rounded-lg px-2 outline-0"
              />
              <select
                name=""
                id=""
                className="border border-gray-200 h-10 rounded-lg px-2 outline-0"
                onChange={(e) => setViewPerPage(parseInt(e.target.value))}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
            </div>
            <div className="flex gap-5 items-center border-t border-gray-200 pt-2 text-gray-500 md:justify-between">
              <h1 className="">Jumlah Berkas : {berkas.length}</h1>
              <h1>
                Halaman {currentPage} : dari {Math.ceil(berkas.length / viewPerPage)}
              </h1>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-blue-700 text-white">
                  <th className="px-2 py-4 rounded-tl-lg">No</th>
                  <th className="">Nama Berkas</th>
                  <th className="px-2 rounded-tr-lg">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`${
                      index % 2 === 0 ? "bg-white" : "bg-blue-200 bg-opacity-50"
                    }`}
                  >
                    <td className="text-center text-gray-700 py-4">
                      {startIndex + index + 1}
                    </td>
                    <td className="text-gray-700 px-2">{item.title}</td>
                    <td className="px-2">
                      <div className="flex justify-center gap-2">
                        {/* Button Preview & Download (membuka di tab baru) */}
                        <button
                          onClick={() => handleOpenViewer(item.id)}
                          className={`p-2 bg-blue-600 text-white ${
                            index % 2 === 0 ? "" : "border-blue-700 border-[2px]"
                          } hover:bg-blue-700 hover:scale-105 transition-all duration-300 rounded-lg flex items-center gap-1`}
                          title="Buka di tab baru"
                        >
                          <Eye className="w-4 h-4 hover:scale-105 cursor-pointer" />
                        </button>

                        {/* Button Download Langsung */}
                        <button
                          onClick={() => handleDirectDownload(item.filepath, item.title)}
                          className={`p-2 bg-green-600 text-white ${
                            index % 2 === 0 ? "" : "border-green-700 border-[2px]"
                          } hover:bg-green-700 hover:scale-105 transition-all duration-300 rounded-lg cursor-pointer`}
                          title="Download langsung"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="w-full h-16 border rounded-b-lg border-blue-400 mb-10 flex justify-between px-5 items-center gap-2">
            <h1 className="text-gray-600">
              Total Page: {Math.ceil(berkas.length / viewPerPage)}{" "}
            </h1>
            <div className="flex h-full items-center text-blue-700 font-bold">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {[...Array(Math.ceil(berkas.length / viewPerPage))].map((_, i) => {
                const page = i + 1;
                if (
                  page === 1 ||
                  page === Math.ceil(berkas.length / viewPerPage) ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 3 || page === currentPage + 3) {
                  return (
                    <span key={page} className="px-2 text-gray-400">
                      ...
                    </span>
                  );
                }
                return null;
              })}
              <button
                onClick={() =>
                  setCurrentPage(
                    Math.min(Math.ceil(berkas.length / viewPerPage), currentPage + 1)
                  )
                }
                disabled={currentPage === Math.ceil(berkas.length / viewPerPage)}
                className="disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}