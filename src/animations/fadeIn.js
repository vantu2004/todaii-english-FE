export const fadeIn = (delay = 0) => ({
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.8,
      delay,
      ease: "easeOut",
    },
  },
});
