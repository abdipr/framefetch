import { useEffect, useRef } from "react";

const BackgroundWrapper = ({ children, preset, coverImage, cardScale }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (wrapperRef.current && window.gsap) {
      window.gsap.to(wrapperRef.current, {
        scale: cardScale,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  }, [cardScale]);

  const getBgStyles = () => {
    const isApplePreset = preset.startsWith("apple");

    if (isApplePreset) {
      return {
        bg: coverImage
          ? `url(${coverImage})`
          : "linear-gradient(to bottom right, #fecdd3, #fda4af)",
        overlay: "bg-white/10 dark:bg-black/40 backdrop-blur-[100px]",
        blur: "blur(80px) saturate(0.6)",
        scale: 2.5,
        translate: "translateY(-30rem)",
      };
    }

    switch (preset) {
      case "spotify":
        return {
          bg: coverImage
            ? `url(${coverImage})`
            : "linear-gradient(to bottom right, #10b981, #047857)",
          overlay:
            "bg-gradient-to-b from-black/20 via-black/40 to-[#121212] backdrop-blur-[100px]",
          blur: "blur(80px) saturate(1.2)",
          scale: 1.1,
          translate: "",
        };
      case "minimal":
      default:
        return {
          bg: "none",
          overlay: "bg-[#fdfdfd] dark:bg-[#09090b]",
          blur: "none",
          scale: 1,
          translate: "",
        };
    }
  };

  const styles = getBgStyles();

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden w-full h-full">
      {/* Background fill */}
      <div
        className="absolute inset-[-20%] bg-cover bg-center"
        style={{
          backgroundImage: styles.bg,
          filter: styles.blur,
          transform: `${styles.translate} scale(${styles.scale})`,
        }}
      />
      {/* Overlay */}
      <div className={`absolute inset-0 ${styles.overlay}`} />

      {/* Content wrapper with dynamic scaling */}
      <div
        ref={wrapperRef}
        className="relative z-10 flex flex-col items-center justify-center w-full px-8 will-change-transform"
      >
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
