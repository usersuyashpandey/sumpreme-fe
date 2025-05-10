import { useEffect, useRef } from "react";
import BannerPlay from "/banner.mp4";

const Banner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.warn("Video autoplay was prevented:", error);
      });
    }
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={BannerPlay} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

      {/* Content */}
      <div className="relative text-center text-white px-6 max-w-4xl">
        <p className="text-sm md:text-lg uppercase pb-2 tracking-wider">
          Driven by performance
        </p>
        <h1 className="text-3xl md:text-5xl font-semibold mt-2">
          Soft trims and <span className="text-blue-400">NVH solutions</span>{" "}
          <br className="hidden sm:block" />
          <span className="text-white font-light">for seamless rides</span>
        </h1>
      </div>
    </section>
  );
};

export default Banner;
