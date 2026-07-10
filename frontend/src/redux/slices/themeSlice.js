import { createSlice } from "@reduxjs/toolkit";

const stored = localStorage.getItem("theme");
const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
const initial = stored || (prefersDark ? "dark" : "light");

if (initial === "dark") document.documentElement.classList.add("dark");

const themeSlice = createSlice({
  name: "theme",
  initialState: { mode: initial },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", state.mode === "dark");
      localStorage.setItem("theme", state.mode);
    },
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
