import React from "react";
import { Routes, Route } from "react-router-dom";
import FormulaIngredientsSetup from "../components/FormulaIngredientsGame/FormulaIngredientsSetup";
import FormulaIngredientsPlay from "../components/FormulaIngredientsGame/FormulaIngredientsPlay";

export default function FormulaIngredientsGame() {
  return (
    <Routes>
  <Route path="/" element={<FormulaIngredientsSetup />} />
  <Route path="play" element={<FormulaIngredientsPlay />} />
</Routes>
  );
}