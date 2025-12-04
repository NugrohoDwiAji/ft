import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect, useState, Children } from "react";

type Props = {
  children: React.ReactNode;
};

export default function Carousel({children}:Props):React.JSX.Element {
  const [currentSlide, setcurrentSlide] = useState(0)
  const [arrows, setarrows] = useState(false)
  const [slidesToShow, setSlidesToShow] = useState(4)
  
  // Hitung jumlah children
  const childrenCount = Children.count(children);

  // Deteksi ukuran layar dan ubah slidesToShow
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) { // mobile
        setSlidesToShow(1);
      } else if (width < 1024) { // tablet
        setSlidesToShow(2);
      } else if (width < 1280) { // desktop small
        setSlidesToShow(3);
      } else { // desktop large
        setSlidesToShow(4);
      }
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const settings = {
    dots: childrenCount > 1, // Hanya tampilkan dots jika lebih dari 1 item
    infinite: childrenCount > slidesToShow, // Infinite hanya jika item > slidesToShow
    speed: 500,
    slidesToShow: Math.min(slidesToShow, childrenCount), // Jangan melebihi jumlah item
    slidesToScroll: 1,
    centerPadding: "0px",
    centerMode: childrenCount > slidesToShow, // Center mode hanya jika item > slidesToShow
    autoplay: childrenCount > 1, // Autoplay hanya jika lebih dari 1 item
    autoplaySpeed: 3000,
    afterChange: (index: number) => setcurrentSlide(index),
    arrows: arrows && childrenCount > slidesToShow, // Arrows hanya jika item > slidesToShow
    customPaging: (i: number) => (
      <div className={`w-2 h-2 mx-1 mt-4 rounded-full  ${currentSlide === i ? "bg-blue-950" : "bg-gray-300/70"}  transition-all duration-300 ease-in-out`} />
    ),
    dotsClass: "slick-dots custom-dots",
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: Math.min(1, childrenCount),
          slidesToScroll: 1,
          centerMode: childrenCount > 1,
          infinite: childrenCount > 1,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, childrenCount),
          slidesToScroll: 1,
          centerMode: childrenCount > 2,
          centerPadding: "0px",
          infinite: childrenCount > 2,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: Math.min(3, childrenCount),
          slidesToScroll: 1,
          centerMode: childrenCount > 3,
          centerPadding: "0px",
          infinite: childrenCount > 3,
        }
      }
    ]
  };

  // Jika hanya 1 item, render tanpa slider
  if (childrenCount === 1) {
    return (
      <div className="relative m-auto">
        <div className="flex justify-center">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="relative m-auto">
      <Slider {...settings}>
        {children}
      </Slider>
    </div>
  );
}