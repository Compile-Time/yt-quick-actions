/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./settings_ui/**/*.{html,ts}"],
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    theme: ["light", "dark"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    darkTheme: "dark",
  },
};
