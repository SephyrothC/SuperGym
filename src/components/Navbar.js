import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./style.css";

function Navbar() {
    const location = useLocation(); // Récupère l'URL actuelle
    const [activeIndex, setActiveIndex] = useState(0);

    // Détermine l'onglet actif en fonction de l'URL
    useEffect(() => {
        const routes = ["/", "/exercices", "/challenges", "/seances", "/statistiques"];
        const index = routes.indexOf(location.pathname);
        if (index !== -1) setActiveIndex(index);
    }, [location.pathname]);

    return (
        <div className="navigation">
            <ul>
                {[
                    { name: "Calendrier", icon: "calendar-outline", path: "/" },
                    { name: "Exercices", icon: "barbell-outline", path: "/exercices" },
                    { name: "Challenges", icon: "trophy-outline", path: "/challenges" },
                    { name: "Séances", icon: "body-outline", path: "/seances" },
                    { name: "Statistiques", icon: "bar-chart-outline", path: "/statistiques" }
                ].map((item, index) => (
                    <li
                        key={index}
                        className={`list ${activeIndex === index ? "active" : ""}`}
                        onClick={() => setActiveIndex(index)}
                    >
                        <Link to={item.path}>
                            <span className="icon">
                                <ion-icon name={item.icon}></ion-icon>
                            </span>
                            <span className="text">{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>
            <div
                className="indicator"
                style={{ left: `calc(${(activeIndex * 100) / 5}% + 10%)` }}
            ></div>
        </div>
    );
}

export default Navbar;
