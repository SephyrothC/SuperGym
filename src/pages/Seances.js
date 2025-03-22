import React, { useState, useEffect } from "react";
import Select from "react-select";
import Card from "react-bootstrap/Card";
import "./seances.css";

const Seances = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [seances, setSeances] = useState([]);
    const [exercices, setExercices] = useState([]);
    const [newSeance, setNewSeance] = useState({
        nom: "",
        couleur: "#ffffff",
        exercices: [],
    });

    // Charger les exercices depuis l'API
    useEffect(() => {
        fetch("http://localhost:5000/api/exercices")
            .then((res) => res.json())
            .then((data) => {
                const formattedExercices = data.map((ex) => ({
                    value: ex.id,
                    label: ex.nom,
                }));
                setExercices(formattedExercices);
            })
            .catch((err) => console.error("Erreur chargement exercices:", err));

        // Charger les séances existantes
        fetch("http://localhost:5000/api/seances")
            .then((res) => res.json())
            .then((data) => setSeances(data))
            .catch((err) => console.error("Erreur chargement séances:", err));
    }, []);

    // Ouvrir/fermer la popup
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    // Gérer les changements dans le formulaire
    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewSeance({ ...newSeance, [name]: value });
    };

    // Gérer la sélection des exercices avec react-select
    const handleExercicesChange = (selectedOptions) => {
        const selectedIds = selectedOptions.map((option) => option.value);
        setNewSeance({ ...newSeance, exercices: selectedIds });
    };

    // Envoyer la nouvelle séance au serveur
    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost:5000/api/seances", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newSeance),
        })
            .then((res) => res.json())
            .then((data) => {
                setSeances([...seances, data]);
                setShowPopup(false);
                setNewSeance({ nom: "", couleur: "#ffffff", exercices: [] });
            })
            .catch((err) => console.error("Erreur ajout séance:", err));
    };

    // Trouver les noms des exercices par ID
    const getExerciceNames = (exercicesIds) => {
        return exercices
            .filter((ex) => exercicesIds.includes(ex.value))
            .map((ex) => ex.label);
    };

    return (
        <div className="seances-container">
            <button className="add-button" onClick={togglePopup}>
                <ion-icon name="add-outline"></ion-icon> Ajouter
            </button>

            <div className="seances-list">
                {seances.map((seance) => (
                    <Card
                        key={seance.id}
                        style={{
                            width: "18rem",
                            backgroundColor: "rgb(78, 78, 78)",
                            color: "#ffffff",
                            margin: "10px",
                            borderRadius: "12px",
                            padding: "10px",
                            height: "auto",
                        }}
                    >
                        <Card.Body>
                            <Card.Title style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "10px", marginLeft: "10px"}}>
                                {seance.nom}
                            </Card.Title>
                            <hr style={{ border: "none", borderTop: "1px solid #ccc", margin: "10px 0" }} /> {/* Ligne de séparation */}
                            <Card.Text>
                                <ul style={{
                                    paddingLeft: "15px", // Ajouter un peu d'espace à gauche des items
                                    maxHeight: "150px", // Limiter la hauteur de la liste
                                    overflowY: "auto", // Permettre le défilement si la liste est trop longue
                                    listStyleType: "disc", // Garde les puces de liste
                                }}>
                                    {getExerciceNames(seance.exercices).map((exerciceName, index) => (
                                        <li key={index}>{exerciceName}</li>
                                    ))}
                                </ul>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>



            {/* Popup d'ajout de séance */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Ajouter une séance</h3>
                        <form onSubmit={handleSubmit}>
                            <input
                                type="text"
                                name="nom"
                                placeholder="Nom de la séance"
                                value={newSeance.nom}
                                onChange={handleChange}
                                required
                            />

                            <label>Choisir une couleur :</label>
                            <input
                                type="color"
                                name="couleur"
                                value={newSeance.couleur}
                                onChange={handleChange}
                                required
                            />

                            <label>Choisir les exercices :</label>
                            <Select
                                isMulti
                                name="exercices"
                                options={exercices}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={handleExercicesChange}
                                value={exercices.filter((ex) =>
                                    newSeance.exercices.includes(ex.value)
                                )}
                            />

                            <button type="submit">Ajouter</button>
                            <button
                                type="button"
                                className="close-button"
                                onClick={togglePopup}
                            >
                                Annuler
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Seances;
