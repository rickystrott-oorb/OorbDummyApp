import type { Config } from "tailwindcss";

export default {
    content: ["./src/**/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                ink: "#12212B",
                sea: "#0F6E7A",
                coral: "#E8734A",
            },
        },
    },
    plugins: [],
} satisfies Config;
