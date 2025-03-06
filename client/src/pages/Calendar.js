import React, { useState, useEffect } from "react";
import Select from "react-select";
import chroma from "chroma-js";
import "./calendar.css";

const dot = (color = "transparent") => ({
    alignItems: "center",
    display: "flex",
    ":before": {
        backgroundColor: color,
        borderRadius: 10,
        content: '" "',
        display: "block",
        marginRight: 8,
        height: 10,
        width: 10,
    },
});

const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: "white" }),
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
        const color = chroma(data.couleur);
        return {
            ...styles,
            backgroundColor: isDisabled
                ? undefined
                : isSelected
                    ? data.couleur
                    : isFocused
                        ? color.alpha(0.1).css()
                        : undefined,
            color: isDisabled
                ? "#ccc"
                : isSelected
                    ? chroma.contrast(color, "white") > 2
                        ? "white"
                        : "black"
                    : data.couleur,
            cursor: isDisabled ? "not-allowed" : "default",
        };
    },
    singleValue: (styles, { data }) => ({ ...styles, ...dot(data.couleur) }),
};

const Calendar = () => {
    const [currentMonth, setCurrentMonth] = useState(0);
    const [trackedDays, setTrackedDays] = useState({});
    const [seances, setSeances] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDay, setSelectedDay] = useState(null);

// 🔥 Charger les séances disponibles depuis le serveur
    useEffect(() => {
        fetch("http://localhost:5000/api/seances")
            .then((res) => res.json())
            .then((data) => {
                setSeances(data);
            })
            .catch((err) => console.error("Erreur lors du chargement des séances disponibles:", err));
    }, []);


    // Charger les séances depuis le fichier JSON
    useEffect(() => {
        fetch("http://localhost:5000/api/calendar")
            .then((res) => res.json())
            .then((data) => {
                const loadedTrackedDays = {};
                data.forEach((entry) => {
                    const date = new Date(entry.date);
                    if (date.getMonth() === currentMonth) {
                        loadedTrackedDays[date.getDate()] = entry.color;
                    }
                });
                setTrackedDays(loadedTrackedDays);
            })
            .catch((err) => console.error("Erreur lors du chargement des séances enregistrées:", err));
    }, [currentMonth]); // Recharge les séances à chaque changement de mois


    const handleDayClick = (day) => {
        setSelectedDay(day);
        setShowPopup(true);
    };

    const handleSeanceSelect = (selectedOption) => {
        const newEntry = {
            date: `2025-${(currentMonth + 1).toString().padStart(2, "0")}-${selectedDay.toString().padStart(2, "0")}`,
            color: selectedOption.couleur,
            seanceId: selectedOption.value, // ID de la séance sélectionnée
        };

        // Envoi des données au serveur
        fetch("http://localhost:5000/api/calendar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newEntry),
        })
            .then((res) => res.json())
            .then(() => {
                setTrackedDays({
                    ...trackedDays,
                    [selectedDay]: selectedOption.couleur,
                });
                setShowPopup(false);
            })
            .catch((err) => console.error("Erreur lors de l'ajout au calendrier:", err));
    };


    const monthNames = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];

    const daysInMonth = new Date(2025, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(2025, currentMonth, 1).getDay();
    const calendarDays = Array(firstDayOfMonth).fill(null).concat(
        Array.from({ length: daysInMonth }, (_, i) => i + 1)
    );

    return (
        <div className="calendar-container">
            <div className="calendar-header">
                <button onClick={() => setCurrentMonth((prev) => (prev - 1 + 12) % 12)}>
                    <ion-icon name="arrow-back-outline"></ion-icon>
                </button>
                <h1 className="calendar-title">{monthNames[currentMonth]} 2025</h1>
                <button onClick={() => setCurrentMonth((prev) => (prev + 1) % 12)}>
                    <ion-icon name="arrow-forward-outline"></ion-icon>
                </button>
            </div>
            <div className="calendar-grid">
                {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((dayName) => (
                    <div key={dayName} className="calendar-day-name">{dayName}</div>
                ))}
                {calendarDays.map((day, index) => (
                    <div
                        key={index}
                        onClick={() => day && handleDayClick(day)}
                        className={`calendar-day ${day ? "clickable" : "empty"}`}
                        style={{
                            backgroundColor: day && trackedDays[day] ? trackedDays[day] : "white",
                        }}
                    >
                        {day && (
                            <span className={trackedDays[day] ? "day-number colored" : "day-number"}>
                                {day}
                            </span>
                        )}
                    </div>
                ))}
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Choisir une séance</h3>
                        <Select
                            options={seances.map((seance) => ({
                                value: seance.id, // ID de la séance
                                label: seance.nom, // Nom de la séance
                                couleur: seance.couleur, // Couleur associée
                            }))}
                            styles={colourStyles}
                            onChange={handleSeanceSelect}
                        />

                        <div className="popup-buttons">
                            <button
                                type="button"
                                className="close-button"
                                onClick={() => setShowPopup(false)}
                            >
                                Fermer
                            </button>
                            <button
                                type="button"
                                className="validate-button"
                                onClick={() => {
                                    // Logique de validation de la sélection
                                    setShowPopup(false);
                                }}
                            >
                                Valider
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;
