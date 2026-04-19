import { useEffect, useRef } from "react";

const BackgroundWrapper = ({ children, preset, coverImage, cardScale, isCardOnly }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (wrapperRef.current && window.gsap) {
      window.gsap.to(wrapperRef.current, {
        scale: isCardOnly ? 1 : cardScale,
        duration: 0.4,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  }, [cardScale, isCardOnly]);

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
    <div className={`${isCardOnly ? 'relative inline-flex w-max h-fit max-w-none px-12 py-12' : 'absolute inset-0 w-full h-full flex items-center justify-center'} overflow-hidden`}>
      {!isCardOnly && (
        <>
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
        </>
      )}

      {/* Content wrapper with dynamic scaling */}
      <div
        ref={wrapperRef}
        className={`relative z-10 flex flex-col items-center justify-center ${isCardOnly ? 'p-0' : 'w-full px-8'} will-change-transform`}
      >
        {children}
      </div>
    </div>
  );
};

export default BackgroundWrapper;
