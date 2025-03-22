import React, { useState, useEffect } from "react";
import "./exercices.css";

const logoOptions = {
    "bras": "arm-logo.svg",
    "dos": "back-logo.svg",
    "fessiers": "but-logo.svg",
    "cardio": "heart-logo.svg",
    "jambes": "leg-logo.svg",
    "torse/abdos": "torso-logo.svg"
};

const Exercices = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [exercices, setExercices] = useState([]);
    const [newExercice, setNewExercice] = useState({
        nom: "",
        mesure: "",
        logo: "",
        PR: ""
    });

    const [editingPR, setEditingPR] = useState(null); // Gérer l'exercice en cours de modification
    const [newPR, setNewPR] = useState(""); // Nouvelle valeur du PR

    // Charger les exercices au démarrage
    useEffect(() => {
        fetch("http://localhost:5000/api/exercices")
            .then((res) => res.json())
            .then((data) => setExercices(data))
            .catch((err) => console.error("Erreur chargement exercices:", err));
    }, []);

    // Ouvrir/fermer la popup
    const togglePopup = () => {
        setShowPopup(!showPopup);
    };

    // Mettre à jour les valeurs du formulaire
    const handleChange = (e) => {
        setNewExercice({ ...newExercice, [e.target.name]: e.target.value });
    };

    // Mettre à jour le logo selon la sélection
    const handleLogoChange = (e) => {
        const selectedCategory = e.target.value;
        setNewExercice({ ...newExercice, logo: logoOptions[selectedCategory] });
    };

    // Ajouter un nouvel exercice via l'API
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch("http://localhost:5000/api/exercices", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newExercice),
        })
            .then((res) => res.json())
            .then((data) => {
                setExercices([...exercices, data]); // Mettre à jour l'affichage
                setShowPopup(false); // Fermer la popup
                setNewExercice({ nom: "", mesure: "", logo: "", PR: "" }); // Réinitialiser
            })
            .catch((err) => console.error("Erreur ajout exercice:", err));
    };

    // Fonction pour activer le mode édition pour un PR
    const handleEditPR = (exercice) => {
        setEditingPR(exercice.id); // Définir quel exercice on est en train de modifier
        setNewPR(exercice.PR); // Pré-remplir avec l'ancien PR
    };

    // Fonction pour enregistrer le PR modifié
    const handleSavePR = (id) => {
        fetch(`http://localhost:5000/api/exercices/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ PR: newPR })
        })
            .then((res) => res.json())
            .then((updatedExercice) => {
                // Mettre à jour l'exercice localement avec le nouveau PR
                setExercices(exercices.map((ex) => (ex.id === updatedExercice.id ? updatedExercice : ex)));
                setEditingPR(null); // Désactiver le mode édition
                setNewPR(""); // Réinitialiser le champ
            })
            .catch((err) => console.error("Erreur mise à jour PR:", err));
    };

    return (
        <div className="exercices-container">
            <button className="add-button" onClick={togglePopup}>
                <ion-icon name="add-outline"></ion-icon> Ajouter
            </button>

            <table className="exercices-table">
                <tbody>
                {exercices.map((ex) => (
                    <tr key={ex.id}>
                        <td className="logo-cell">
                            <img src={`./assets/${ex.logo}`} alt={ex.nom} className="ex-logo" />
                        </td>
                        <td className="name-cell">{ex.nom}</td>
                        <td className="pr-cell">
                            {editingPR === ex.id ? (
                                <>
                                    <input
                                        type="number"
                                        value={newPR}
                                        onChange={(e) => setNewPR(e.target.value)}
                                        required
                                    />
                                    <button onClick={() => handleSavePR(ex.id)}>Sauvegarder</button>
                                    <button onClick={() => setEditingPR(null)}>Annuler</button>
                                </>
                            ) : (
                                <>
                                    {ex.PR} {ex.mesure}
                                    <button className="edit-button" onClick={() => handleEditPR(ex)}>Modifier</button>
                                </>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Popup d'ajout */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <h3>Ajouter un exercice</h3>
                        <form onSubmit={handleSubmit}>
                            <input type="text" name="nom" placeholder="Nom de l'exercice" value={newExercice.nom} onChange={handleChange} required />
                            <input type="text" name="mesure" placeholder="Unité (kg, répétitions...)" value={newExercice.mesure} onChange={handleChange} required />

                            <select name="logo" onChange={handleLogoChange} required>
                                <option value="">Sélectionner une catégorie</option>
                                {Object.keys(logoOptions).map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <input type="number" name="PR" placeholder="PR (max atteint)" value={newExercice.PR} onChange={handleChange} required />
                            <button type="submit">Ajouter</button>
                            <button type="button" className="close-button" onClick={togglePopup}>Annuler</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Exercices;
