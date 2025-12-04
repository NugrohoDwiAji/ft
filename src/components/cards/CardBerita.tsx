'use client'

import React, { useEffect } from "react";
import ButtonPrimary from "../elements/ButtonPrimary";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";

type Props = {
  title: string;
  content: string;
  img : string;
  date : string
  id:string
};  
export default function CardBerita({title, content, img, date, id}: Props) {


const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};
  const router = useRouter();

    useEffect(() => {
    // AOS.init({
    //   duration: 500, // Durasi animasi dalam milidetik
    //   once: false, // Animasi hanya berjalan sekali
    //   easing: "ease-in-out", // Efek transisi animasi
    // });
  }, []);
  return (
    <div data-aos="zoom-in-up" className="h-[30rem] text-start w-72 md:w-72 shadow-xl shadow-gray-300 rounded-xl p-3 flex flex-col justify-between gap-4 bg-white">
      <img
        src={img}
        alt="notfound"
        className="h-52 w-full rounded-xl "
      />
      <div>
        <h1 className="font-bold text-lg">{truncateText(title, 30)}</h1>
        <p className="text-wrap overflow-hidden max-h-28">
          {truncateText(content, 120)}
        </p>
      </div>
      <div className="flex justify-between items-center">

      <ButtonPrimary ClassName="w-fit py-2 bg-blue-800 text-white rounded-md hover:border-2 hover:border-blue-800 hover:bg-white hover:font-semibold hover:text-blue-800" onClick={() => {router.push(`/details/${id}`)}}>
        Selengkapnya
      </ButtonPrimary>
      <h6 className="text-sm text-gray-600">{date=format(new Date(date), "yyyy-MM-dd")}</h6>
      </div>
    </div>
  );
}
