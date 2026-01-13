import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      clipPath: {
        'ellipse': 'ellipse(50% 50% at 50% 50%)',
        'diagonal': 'polygon(0 0, 100% 0, 100% 100%, 0 85%)',
        'wave': 'ellipse(100% 55% at 48% 44%)',
      },
    },
  },
  plugins: [],
};
export default config;