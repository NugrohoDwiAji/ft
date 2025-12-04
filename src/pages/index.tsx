import React, { useState, useEffect } from "react";
import CardBerita from "../components/cards/CardBerita";
import ButtonPrimary from "@/components/elements/ButtonPrimary";
import axios from "axios";
import CardPengumuman from "@/components/cards/CardPengumuman";
import AOS from "aos";
import "aos/dist/aos.css";
import AnimatedNumber from "@/components/elements/AnimatedNumber";
import { useRouter } from "next/router";
import Link from "next/link";
import CardFaq from "@/components/cards/CardFaq";
import Carausel from "@/components/Carausel";

type ContentType = {
  id: string;
  title: string;
  value: string;
};

type IdentitasType = {
  id: string;
  name: string;
  value: string;
};

type PengumumanType = {
  id: string;
  title: string;
  file_path: string;
  uploadat: string;
};

type DataBerita = {
  id: string;
  title: string;
  description: string;
  filepath: string;
  uploudat: string;
};
type QuestionAnswer = {
  id: string;
  question: string;
  answer: string;
  created_at: string;
};
export default function Home() {
  const [dataFaq, setDataFaq] = useState<QuestionAnswer[]>([]);
  const [dataContent, setdataContent] = useState<ContentType[]>([]);
  const [identitas, setIdentitas] = useState<IdentitasType[]>([]);
  const [dataBerita, setDataBerita] = useState<DataBerita[]>([]);
  const [dataPengumuman, setDataPengumuman] = useState<PengumumanType[]>([]);
  const router = useRouter();

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleGetIdentitas = async () => {
    try {
      const result = await axios.get("/api/identitas");
      setIdentitas(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetContent = async () => {
    try {
      const result = await axios.get("/api/content");
      setdataContent(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetPengumuman = async () => {
    try {
      const result = await axios.get("/api/pengumuman");
      setDataPengumuman(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleGetBerita = async () => {
    try {
      const result = await axios.get("/api/berita");
      setDataBerita(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetFaq = async () => {
    try {
      const result = await axios.get("/api/faq");
      setDataFaq(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetFaq();
    handleGetBerita();
    handleGetIdentitas();
    handleGetContent();
    handleGetPengumuman();
    axios.get("/api/track", { params: { url: "/" } }).catch((err) => {
      console.log("Tracking error:", err);
    });
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 300, // Durasi animasi dalam milidetik
      once: true, // Animasi hanya berjalan sekali
      easing: "ease-in-out", // Efek transisi animasi
    });
  }, []);
  return (
    <div className="">
      {/* Banner */}
      <div className="bg-[url(/img/banner-ft.png)] h-[18rem] md:h-[31rem] lg:h-[40rem] bg-cover md:bg-center bg-right">
        <div className="h-full w-full flex px-5 md:px-12 lg:px-20 items-center md:justify-between ">
          <div className="w-[50%] flex flex-col gap-2 -mt-9 md:-mt-20 lg:-mt-36">
            <h1 className=" font-bold text-gray-800 md:text-2xl lg:text-4xl uppercase">
             <span className="text-transparent bg-gradient-to-r from-blue-400 to-purple-900 bg-clip-text"> {identitas?.find((item) => item.name === "Nama Fakultas")?.value}</span>
              <br /> UNIVERSITAS BUMIGORA
            </h1>
            <p className="text-[8px] md:text-sm lg:text-lg text-white hidden md:block lg:w-96">
              {dataContent?.find((item) => item.title === "Tagline")?.value}
            </p>
            
            <a
              className="mt-2 md:mt-5 border-2 bg-blue-700 text-white px-4 py-2 md:px-6  rounded-lg hover:scale-105 hover:shadow-2xl shadow-lg ease-in-out duration-300 transition-all text-sm md:text-xl w-fit hover:cursor-pointer "
              href="https://pmb.universitasbumigora.ac.id/v.2019/daftar"
            >
              Daftar Sekarang
            </a>
     
          </div>
        </div>
      </div>

      {/* Tentang Fakultas */}
      <div className="flex flex-col items-center p-5 gap-5 lg:h-[40rem]">
        <h1 className="text-xl lg:text-2xl font-bold lg:mt-10  text-blue-800">
          Tentang Fakultas
        </h1>
        <div className="bg-gradient-to-tr from-blue-600 to-purple-600 w-[50%] md:w-[25%] lg:w-[14%] h-[2px] lg:mb-5 " ></div>
        <div className="md:flex gap-32 justify-center lg:px-14 md:h-[28rem] pb-10 ">
          <div className="h-full flex items-start justify-center w-[40%] ">
            <img
              data-aos="flip-left"
              data-aos-easing="ease-out-cubic"
              data-aos-duration="1000"
              src="/img/aktor1.png"
              alt=""
              className="hidden md:block md:h-64 lg:h-full "
            />
          </div>
          <div className="md:w-[45%] h-full flex flex-col gap-5 justify-center">
            <p className="text-justify indent-10 max-h-[23rem] truncate text-wrap lg:text-lg text-gray-900">
              {truncateText(
                dataContent?.find((item) => item.title === "Tentang Fakultas")
                  ?.value || "",

                600
              )}
            </p>
            <ButtonPrimary
              ClassName="bg-blue-700 text-white hover:text-blue-700 hover:bg-white hover:border-2 hover:border-blue-700 font-semibold ease-in-out duration-300 transition-all"
              onClick={() => router.push("/informasi")}
            >
              Selengkapnya
            </ButtonPrimary>
          </div>
        </div>
      </div>

      {/* Information */}
      <div className="h-fit bg-[url(/img/bg-kampus.jpg)] bg-center bg-cover">
        <div className="bg-gradient-to-r from-blue-700 to-purple-700 h-full text-white font-bold flex justify-center items-center gap-6 md:gap-20 lg:gap-36 py-3 md:py-12 px-4 flex-wrap md:flex-row  ">
          <div className="flex gap-2 items-center md:gap-4">
            <h1 className="text-2xl md:text-5xl lg:text-6xl ">
              <AnimatedNumber
                end={Number(
                  identitas?.find(
                    (item) => item.name === "Banyak Program Studi"
                  )?.value || 0
                )}
                duration={4}
              />
            </h1>
            <h1 className="md:text-lg lg:text-2xl">Program Studi</h1>
          </div>
          <Link
            href={"/dosen"}
            className="flex gap-2 items-center md:gap-4 hover:scale-105 hover:shadow-2xl  ease-in-out duration-300 transition-all"
          >
            <h1 className="text-2xl md:text-5xl lg:text-6xl ">
              <AnimatedNumber
                end={Number(
                  identitas?.find((item) => item.name === "Banyak Dosen")
                    ?.value || 0
                )}
                duration={6}
              />
            </h1>
            <h1 className="md:text-lg lg:text-2xl">Dosen</h1>
          </Link>
          <div className="flex gap-2 items-center md:gap-4">
            <h1 className="text-2xl md:text-5xl lg:text-6xl ">
              <AnimatedNumber
                end={Number(
                  identitas?.find((item) => item.name === "Banyak Staf")
                    ?.value || 0
                )}
                duration={6}
              />
            </h1>
            <h1 className="md:text-lg lg:text-2xl">Staf</h1>
          </div>
        </div>
      </div>

      {/* Berita */}
      <div className="flex flex-col items-center py-5 lg:py-10 bg-white gap-5 h-fit">
        <h1 className="text-xl lg:text-2xl font-bold text-blue-700">
          Berita
        </h1>
        <hr className="border-t-[3px] border-blue-700 w-[20%] md:w-[15%] lg:w-[6%]  mb-5" />
        <div className="w-full ">
          <center>
          <Carausel>
            {dataBerita.slice(0, 6).map((item, index) => (
              <div key={index} className="my-4 w-full ">
                <CardBerita
                  key={index}
                  img={item.filepath}
                  content={item.description}
                  title={item.title}
                  date={item.uploudat}
                  id={item.id}
                />
              </div>
            ))}
          </Carausel>
          </center>
          <div className="mt-10 w-full flex justify-center">
            <ButtonPrimary
              ClassName="bg-blue-700 text-white hover:text-blue-700 hover:bg-white hover:border-2 hover:border-blue-700 font-semibold ease-in-out duration-300 transition-all"
              onClick={() => router.push("/berita")}
            >
              Selengkapnya
            </ButtonPrimary>
          </div>
        </div>
      </div>

      {/* Pengumuman */}
      <div className="h-fit bg-[url(/img/bg-kampus.jpg)] bg-center bg-cover">
        <div className="bg-gradient-to-r from-blue-700 to-purple-700 h-full flex justify-center items-center gap-6 md:gap-20 lg:gap-36 py-3 md:py-12 px-4 flex-wrap md:flex-row  ">
          <div className="flex flex-col items-center">
            <h1 className="text-xl lg:text-2xl font-bold text-white">
              Pengumuman
            </h1>
            <hr className="border-t-[3px] border-white w-[50%] md:w-[30%]  mt-5" />
            <div className="w-screen mt-16">
              <Carausel>
                {dataPengumuman.map((item, index) => (
                  <CardPengumuman
                    key={index}
                    file_path={item.file_path}
                    title={item.title}
                    uploadat={item.uploadat}
                  />
                ))}
              </Carausel>
               <div className="mt-10 w-full flex justify-center">
            <ButtonPrimary
              ClassName="hover:bg-blue-700 m-auto hover:text-white text-blue-700 bg-white border-2 border-blue-700 font-semibold ease-in-out duration-300 transition-all"
              onClick={() => router.push("/pengumuman")}
            >
              Selengkapnya
            </ButtonPrimary>
          </div>
            </div>
          </div>
        </div>
      </div>

      {/* FaQ */}
      <div className="flex flex-col items-center py-5 lg:py-10 bg-white  h-fit">
        <h1 className="text-xl lg:text-2xl font-bold text-blue-700">FAQ</h1>
        <div className="flex gap-5 md:gap-2 flex-wrap justify-center mt-10">
          {dataFaq.slice(0, 4).map((item, index) => (
            <CardFaq
              key={index}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>

        <ButtonPrimary
          ClassName="bg-blue-700 text-white hover:text-blue-700 hover:bg-white hover:border-2 hover:border-blue-700 font-semibold ease-in-out duration-300 transition-all"
          onClick={() => router.push("/faq")}
        >
          Lihat Semua
        </ButtonPrimary>
      </div>

      {/* logo */}
      <div className="flex justify-center items-center pb-5 bg-white md:gap-5 h-fit ">
        <img
          data-aos="zoom-in-right"
          src="/img/ubg-full.jpg"
          alt="eror"
          className=" h-24 md:h-36"
        />
        <div className="h-32 w-[2px] bg-blue-700 mx-2"></div>
        <img
          data-aos="zoom-in-left"
          src="/img/banpt.png"
          alt="eror"
          className="h-20 md:h-32"
        />
        <div className="h-32 w-[2px] bg-blue-700 mx-2"></div>
        <img
          data-aos="zoom-in-down"
          src="/img/laminfokom.png"
          alt="eror"
          className=" h-24 md:h-32"
        />
      </div>
    </div>
  );
}
