import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF7CC",
        blush: "#FF9FC1",
        sky: "#7DCDFF",
        mint: "#7BE3B3",
        orange: "#FFB24D",
        lavender: "#B69CFF",
        ink: "#49362F",
        softline: "#F1B86B",
        paper: "#FFFDF8",
        sunny: "#FFE25C",
        coral: "#FF7D6B"
      },
      boxShadow: {
        note: "0 16px 42px rgba(178, 111, 49, 0.16)",
        sticker: "0 12px 24px rgba(103, 120, 222, 0.22)"
      },
      borderRadius: {
        "4xl": "2rem"
      },
      backgroundImage: {
        "board-pattern":
          "radial-gradient(circle at 14% 18%, rgba(255,159,193,0.48), transparent 24%), radial-gradient(circle at 83% 6%, rgba(125,205,255,0.45), transparent 22%), radial-gradient(circle at 76% 76%, rgba(123,227,179,0.42), transparent 23%), radial-gradient(circle at 36% 82%, rgba(255,226,92,0.34), transparent 18%)"
      }
    }
  },
  plugins: []
};

export default config;
