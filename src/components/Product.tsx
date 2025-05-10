import { useState, useEffect, useRef } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { FaPlay, FaPause } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "react-circular-progressbar/dist/styles.css";

const VIDEOS = {
  passenger: [
    {
      src: "/passenger/passenger-complete-body.mp4",
      name: "Complete body",
      thumbnail: "/passenger/passenger-body-thumbmail.webp",
    },
    {
      src: "/passenger/passenger-front.mp4",
      name: "Front",
      thumbnail: "/passenger/passenger-front-thumbmail.webp",
    },
    {
      src: "/passenger/passenger-cabin.mp4",
      name: "Cabin",
      thumbnail: "/passenger/passenger-cabin-thumb.webp",
    },
    {
      src: "/passenger/passenger-trunk.mp4",
      name: "Trunk",
      thumbnail: "/passenger/passenger-trunk-thumb.webp",
    },
    {
      src: "/passenger/passenger-exterior.mp4",
      name: "Exterior",
      thumbnail: "/passenger/passenger-exterior-thumbmail.webp",
    },
  ],
  commercial: [
    {
      src: "/commercial/commercial-complete-body.mp4",
      name: "Complete body",
      thumbnail: "/commercial/commercial-body-thumbmail.svg",
    },
    {
      src: "/commercial/commercial-engine.mp4",
      name: "Engine",
      thumbnail: "/commercial/commercial-engine-thumbmail.svg",
    },
    {
      src: "/commercial/commercial-cabin.mp4",
      name: "Cabin",
      thumbnail: "/commercial/commercial-cabin-thumbmail.svg",
    },
  ],
};

const VARIANTS = {
  tab: {
    active: {
      color: "#ffffff",
      scale: 1.05,
      transition: { duration: 0.3 },
    },
    inactive: {
      color: "#333333",
      scale: 1,
      transition: { duration: 0.3 },
    },
  },
  content: {
    hidden: {
      opacity: 0,
      y: 20,
      transition: { duration: 0.4 },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.3 },
    },
  },
  indicator: {
    passenger: {
      top: 0,
      height: "50%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    commercial: {
      top: "50%",
      height: "50%",
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
  },
};

const Product = () => {
  // Desktop view state
  const [activeTab, setActiveTab] = useState<"passenger" | "commercial">(
    "passenger"
  );
  const [activeVideo, setActiveVideo] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);

  // Mobile view state
  const [passengerIndex, setPassengerIndex] = useState(0);
  const [commercialIndex, setCommercialIndex] = useState(0);
  const [videosLoaded, setVideosLoaded] = useState({
    passenger: Array(VIDEOS.passenger.length).fill(false),
    commercial: Array(VIDEOS.commercial.length).fill(false),
  });

  const sectionRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRefs = useRef({
    passenger: Array(VIDEOS.passenger.length),
    commercial: Array(VIDEOS.commercial.length),
  });

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const sectionHeight = rect.height;
        const sectionTop = rect.top;
        const viewportHeight = window.innerHeight;

        const visibleSectionHeight =
          Math.min(viewportHeight, sectionHeight + sectionTop) -
          Math.max(0, sectionTop);

        const scrollPercentage = (visibleSectionHeight / sectionHeight) * 100;

        if (scrollPercentage > 95 && activeTab === "passenger") {
          setActiveTab("commercial");
          setActiveVideo(0);
        } else if (scrollPercentage < 75 && activeTab === "commercial") {
          setActiveTab("passenger");
          setActiveVideo(0);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [activeTab]);

  // Update video progress
  useEffect(() => {
    let intervalId: number | undefined;

    if (desktopVideoRef.current && isPlaying) {
      intervalId = window.setInterval(() => {
        const current = desktopVideoRef.current?.currentTime || 0;
        const duration = desktopVideoRef.current?.duration || 0;
        if (duration > 0) {
          setVideoProgress((current / duration) * 100);
        }
      }, 100);
    }

    return () => {
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    if (desktopVideoRef.current) {
      desktopVideoRef.current.addEventListener("loadedmetadata", () => {
        setVideoProgress(0);
        if (isPlaying) {
          desktopVideoRef.current?.play();
        }
      });
    }
  }, [activeVideo, activeTab, isPlaying]);

  useEffect(() => {
    const videoElement = mobileVideoRefs.current.passenger[passengerIndex];
    if (videoElement && videosLoaded.passenger[passengerIndex]) {
      videoElement.currentTime = 0;
      videoElement
        .play()
        .catch((error: Error) =>
          console.error("Passenger video play error:", error)
        );
    }
  }, [passengerIndex, videosLoaded.passenger]);

  useEffect(() => {
    const videoElement = mobileVideoRefs.current.commercial[commercialIndex];
    if (videoElement && videosLoaded.commercial[commercialIndex]) {
      videoElement.currentTime = 0;
      videoElement
        .play()
        .catch((error: Error) =>
          console.error("Commercial video play error:", error)
        );
    }
  }, [commercialIndex, videosLoaded.commercial]);

  const handleTabClick = (tab: "passenger" | "commercial"): void => {
    setActiveTab(tab);
    setActiveVideo(0);
    setVideoProgress(0);
  };

  interface VideoChangeHandler {
    (index: number): void;
  }

  const handleVideoChange: VideoChangeHandler = (index) => {
    setActiveVideo(index);
    setVideoProgress(0);
  };

  const togglePlayPause = () => {
    if (desktopVideoRef.current) {
      if (isPlaying) {
        desktopVideoRef.current.pause();
      } else {
        desktopVideoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  interface VideoType {
    passenger: boolean[];
    commercial: boolean[];
  }

  const handleVideoLoaded = (type: keyof VideoType, index: number): void => {
    setVideosLoaded((prev: VideoType) => ({
      ...prev,
      [type]: prev[type].map((loaded: boolean, i: number) =>
        i === index ? true : loaded
      ),
    }));
  };

  interface HandleVideoEnd {
    (type: "passenger" | "commercial"): void;
  }

  const handleVideoEnd: HandleVideoEnd = (type) => {
    if (type === "passenger") {
      setPassengerIndex((passengerIndex + 1) % VIDEOS.passenger.length);
    } else {
      setCommercialIndex((commercialIndex + 1) % VIDEOS.commercial.length);
    }
  };

  const currentVideos = VIDEOS[activeTab];
  const currentVideo = currentVideos[activeVideo];

  return (
    <>
      {/* Desktop View */}
      <div
        ref={sectionRef}
        className="h-screen w-full bg-black text-white py-10 hidden lg:flex"
      >
        <div className="h-full w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="py-10 px-5 flex flex-col items-center justify-center"
          >
            <h1 className="text-2xl md:text-5xl text-center font-light leading-snug max-w-3xl">
              Evolving the drive with{" "}
              <strong className="font-bold">360-degree</strong> comprehensive
              solutions
            </h1>
          </motion.div>

          <div className="flex flex-col md:flex-row justify-center items-start px-5 md:px-20 pb-20 gap-8">
            <div className="flex gap-16">
              <div className="transform -translate-y-1/2 w-1 h-58 rounded-full bg-gray-500 mt-30 relative">
                <motion.div
                  className="absolute w-1 rounded-full bg-white"
                  variants={VARIANTS.indicator}
                  animate={activeTab}
                ></motion.div>
              </div>

              <div className="flex flex-col gap-12 w-full">
                {/* Passenger Tab */}
                <motion.div
                  className="cursor-pointer"
                  variants={VARIANTS.tab}
                  animate={activeTab === "passenger" ? "active" : "inactive"}
                  onClick={() => handleTabClick("passenger")}
                  whileTap={{ scale: 0.98 }}
                >
                  <h2 className="text-2xl font-semibold">Passenger Vehicles</h2>
                  <p className="text-lg mt-2 w-56">
                    Revving up innovation from interior to exterior.
                  </p>
                </motion.div>

                {/* Commercial Tab */}
                <motion.div
                  className="cursor-pointer"
                  variants={VARIANTS.tab}
                  animate={activeTab === "commercial" ? "active" : "inactive"}
                  onClick={() => handleTabClick("commercial")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h2 className="text-2xl font-semibold">
                    Commercial Vehicles
                  </h2>
                  <p className="text-lg mt-2">
                    Advancing engineering for heavy-duty vehicles.
                  </p>
                </motion.div>
              </div>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                className="md:w-2/3 flex flex-col items-center gap-6"
                variants={VARIANTS.content}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <motion.div
                  className="w-full h-64 bg-black relative overflow-hidden flex justify-center"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <video
                    key={`${activeTab}-${activeVideo}`}
                    ref={desktopVideoRef}
                    className="w-auto h-full object-cover"
                    src={currentVideo.src}
                    autoPlay
                    muted
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => {
                      setIsPlaying(false);
                      setVideoProgress(0);
                    }}
                  />
                </motion.div>
                <div className="flex gap-10 items-center">
                  {/* Video Thumbnails */}
                  {currentVideos.map((video, index) => (
                    <button
                      key={index}
                      onClick={() => handleVideoChange(index)}
                      className={`p-1 cursor-pointer rounded flex flex-col items-center justify-center ${
                        activeVideo === index
                          ? "opacity-100"
                          : "opacity-50 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={video.thumbnail}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>{video.name}</div>
                    </button>
                  ))}

                  <button
                    className="w-16 h-16 relative cursor-pointer"
                    onClick={togglePlayPause}
                  >
                    <CircularProgressbar
                      value={videoProgress}
                      text={isPlaying ? "" : ""}
                      styles={buildStyles({
                        pathColor: "#fff",
                        trailColor: "rgba(255,255,255,0.3)",
                        textSize: "0px",
                      })}
                    />
                    <motion.div
                      className="absolute inset-0 flex items-center justify-center text-white"
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 1 }}
                      whileHover={{
                        scale: 1.2,
                        textShadow: "0px 0px 8px rgba(255, 255, 255, 0.5)",
                      }}
                    >
                      {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
                    </motion.div>
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="relative w-auto mx-auto py-20 block lg:hidden bg-black">
        <h1 className="text-2xl md:text-5xl text-center text-regular max-w-3xl leading-relaxed text-white">
          Evolving the drive with{" "}
          <strong className="font-semibold">360-degree</strong> comprehensive
          solutions
        </h1>

        {/* Passenger Videos (Mobile) */}
        <div>
          <div className="text-center pt-6">
            <h4 className="sg-translate text-xl text-blue mb-2 font-semibold text-[#00bfff]">
              Passenger Vehicles
            </h4>
            <p className="text-white font-sm">
              Revving up innovation <br /> from interior to exterior.
            </p>
          </div>

          <div className="relative w-full aspect-video overflow-hidden rounded-lg flex items-center">
            {VIDEOS.passenger.map((video, index) => (
              <video
                key={`passenger-${index}`}
                ref={(el) => {
                  if (el) mobileVideoRefs.current.passenger[index] = el;
                }}
                src={video.src}
                className={`absolute w-full h-auto object-cover transition-opacity duration-500 ${
                  index === passengerIndex ? "opacity-100" : "opacity-0"
                }`}
                muted
                preload="auto"
                playsInline
                onLoadedData={() => handleVideoLoaded("passenger", index)}
                onEnded={() => handleVideoEnd("passenger")}
              />
            ))}
          </div>

          <p className="text-white text-lg text-center mt-3">
            {VIDEOS.passenger[passengerIndex].name}
          </p>

          <div className="flex justify-center gap-2 mt-3">
            {VIDEOS.passenger.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === passengerIndex
                    ? "bg-[#00bfff] w-8"
                    : "bg-[#00aeef59]"
                }`}
                onClick={() => setPassengerIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Commercial Videos (Mobile) */}
        <div className="mt-10">
          <div className="text-center pt-6">
            <h4 className="sg-translate text-xl text-blue mb-2 font-semibold text-[#00bfff]">
              Commercial Vehicles
            </h4>
            <p className="text-white font-sm">
              Advancing engineering for heavy-duty vehicles.
            </p>
          </div>

          <div className="relative w-full aspect-video overflow-hidden rounded-lg flex items-center">
            {VIDEOS.commercial.map((video, index) => (
              <video
                key={`commercial-${index}`}
                ref={(el) => {
                  if (el) mobileVideoRefs.current.commercial[index] = el;
                }}
                src={video.src}
                className={`absolute w-full h-auto object-cover transition-opacity duration-500 ${
                  index === commercialIndex ? "opacity-100" : "opacity-0"
                }`}
                muted
                preload="auto"
                playsInline
                onLoadedData={() => handleVideoLoaded("commercial", index)}
                onEnded={() => handleVideoEnd("commercial")}
              />
            ))}
          </div>

          <p className="text-white text-lg text-center mt-3">
            {VIDEOS.commercial[commercialIndex].name}
          </p>

          <div className="flex justify-center gap-2 mt-3">
            {VIDEOS.commercial.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === commercialIndex
                    ? "bg-[#00bfff] w-8"
                    : "bg-[#00aeef59]"
                }`}
                onClick={() => setCommercialIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
