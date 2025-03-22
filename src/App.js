import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Exercices from "./pages/Exercices";
import Calendar from "./pages/Calendar";
import Challenge from "./pages/Challenges";
import Seances from "./pages/Seances";
import Statistiques from "./pages/Statistiques";

function App() {
    return (
        <Router>
            <Navbar /> {/* Affichage de la navbar sur toutes les pages */}
            <Routes>
                <Route path="/" element={<Navigate to="/calendar" />} />
                <Route path="/exercices" element={<Exercices />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/challenges" element={<Challenge />} />
                <Route path="/seances" element={<Seances />} />
                <Route path="/statistiques" element={<Statistiques />} />
            </Routes>
        </Router>
    );
}

export default App;
