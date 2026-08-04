"use client";

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        // Pakai endpoint asli lo
        const response = await axios.get('http://127.0.0.1:8000/api/hero-slides');
        // Ambil dari response.data.data
        setSlides(response.data.data);
      } catch (error) {
        console.error("Gagal load slider:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Fungsi buat pastiin ID Youtube bersih (ngilangin ?si=xxx kalo ada)
  const cleanYoutubeID = (rawId) => {
    if (!rawId) return null;
    return rawId.split('?')[0]; // Ambil karakter sebelum tanda tanya
  };

  const handleSlideChange = () => {
    if (!sliderRef.current) return;
    const iframes = sliderRef.current.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      iframe.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
    });
  };

  if (loading) return <div className="w-full aspect-video rounded-xl bg-gray-200 animate-pulse" />;

  return (
    <div ref={sliderRef} className="w-full aspect-video rounded-xl overflow-hidden shadow-xl bg-gray-200">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation={true}
        pagination={{ clickable: true }}
        autoplay={{ delay: 8000, disableOnInteraction: true }}
        loop={slides.length > 1}
        onSlideChange={handleSlideChange}
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            {/* Pakai 'type' sesuai JSON lo */}
            {slide.type === 'video' ? (
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${cleanYoutubeID(slide.video_id_youtube)}?enablejsapi=1&rel=0`}
                title={slide.judul}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="w-full h-full"
              ></iframe>
            ) : (
              <div className="relative w-full h-full">
                <Image
                  // Pakai 'gambar_url' dan replace ke storage
                  src={slide.gambar_url ? slide.gambar_url.replace('/uploads/', '/storage/') : '/logo.png'}
                  alt={slide.judul || "Slider IPM"}
                  fill
                  className="object-cover"
                  unoptimized
                />
                {/* Overlay Judul Singkat (Opsional, biar keren) */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-8">
                   <h3 className="text-white font-bold text-xl">{slide.judul}</h3>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}