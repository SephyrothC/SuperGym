import React, { useState, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, BarChart, Bar
} from "recharts";

const Statistiques = () => {
    const [calendarData, setCalendarData] = useState([]);
    const [seancesData, setSeancesData] = useState([]);
    const [seancesParMois, setSeancesParMois] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(0);
    const [seancesMois, setSeancesMois] = useState([]);

    // Charger les données depuis les API
    useEffect(() => {
        const fetchCalendarData = fetch("http://localhost:5000/api/calendar").then((res) => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        });

        const fetchSeancesData = fetch("http://localhost:5000/api/seances").then((res) => {
            if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
            return res.json();
        });

        Promise.all([fetchCalendarData, fetchSeancesData])
            .then(([calendar, seances]) => {
                setCalendarData(calendar);
                setSeancesData(seances);

                // Calculer les séances par mois
                const seancesParMoisCalc = calendar.reduce((acc, item) => {
                    const month = new Date(item.date).getMonth();
                    acc[month] = acc[month] ? acc[month] + 1 : 1;
                    return acc;
                }, Array(12).fill(0));

                const formattedData = seancesParMoisCalc.map((count, index) => ({
                    mois: new Date(2025, index).toLocaleString("fr-FR", { month: "long" }),
                    totalSeances: count,
                }));

                setSeancesParMois(formattedData);
                updateSeancesMois(calendar, seances, selectedMonth);
            })
            .catch((err) => console.error("Erreur lors du chargement des données :", err));
    }, []);

    // Met à jour les données du mois sélectionné
    const updateSeancesMois = (calendar, seances, month) => {
        const seancesFiltrees = calendar.filter((item) => new Date(item.date).getMonth() === month);
        const seancesCount = seancesFiltrees.reduce((acc, item) => {
            const seance = seances.find((s) => s.id === item.seanceId);
            const nom = seance ? seance.nom : "Séance inconnue";
            acc[nom] = (acc[nom] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.keys(seancesCount).map((nom) => ({
            nom,
            total: seancesCount[nom],
        }));

        setSeancesMois(formattedData);
    };

    const handlePrevMonth = () => {
        const newMonth = (selectedMonth - 1 + 12) % 12;
        setSelectedMonth(newMonth);
        updateSeancesMois(calendarData, seancesData, newMonth);
    };

    const handleNextMonth = () => {
        const newMonth = (selectedMonth + 1) % 12;
        setSelectedMonth(newMonth);
        updateSeancesMois(calendarData, seancesData, newMonth);
    };

    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    return (
        <div className="seances-chart">
            {/* Graphique des séances par mois */}
            <h2 style={{ color: "white" }}>Nombre total de séances par mois</h2>
            <ResponsiveContainer width="100%" height={400}>
                <LineChart data={seancesParMois}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="mois" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="totalSeances" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>

            {/* Répartition des séances du mois sélectionné */}
            <div className="month-navigation" style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2rem" }}>
                <button onClick={handlePrevMonth}><ion-icon name="arrow-back-outline"></ion-icon></button>
                <h3 style={{ margin: "0 1rem", color: "white" }}>{monthNames[selectedMonth]}</h3>
                <button onClick={handleNextMonth}><ion-icon name="arrow-forward-outline"></ion-icon></button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={seancesMois}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nom" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#82ca9d" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default Statistiques;
