import React from "react";
import { Routes, Route } from "react-router-dom";
import HerbMemorySetup from "../components/HerbGame/HerbMemorySetup";
import HerbMemoryPlay from "../components/HerbGame/HerbMemoryPlay";

export default function HerbMemoryGame() {
  return (
    <Routes>
      <Route path="/" element={<HerbMemorySetup />} />
      <Route path="play" element={<HerbMemoryPlay />} />
    </Routes>
  );
}