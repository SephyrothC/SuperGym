import React, { useState, useEffect } from "react";
import "./challenges.css";

const ProgressBar = ({ progress }) => {
    return (
        <div className="custom-progress-bar">
            <div className="custom-progress-fill" style={{ width: `${progress}%` }}>
                {progress}%
            </div>
        </div>
    );
};

const Challenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [expGagnee, setExpGagnee] = useState(0);
    const [niveau, setNiveau] = useState(1);
    const [experience, setExperience] = useState(0);
    const [experiencePourNiveauSuivant, setExperiencePourNiveauSuivant] = useState(100);

    // Charger les challenges et la progression
    useEffect(() => {
        // Récupère les challenges
        fetch("http://localhost:5000/api/challenges")
            .then((res) => res.json())
            .then((data) => setChallenges(data))
            .catch((err) => console.error("Erreur chargement challenges:", err));

        // Récupère la progression de l'utilisateur
        fetch("http://localhost:5000/api/progression")
            .then((response) => response.json())
            .then((data) => {
                console.log("Données de progression reçues:", data); // Vérifiez si vous obtenez l'objet attendu
                const progression = data;
                setNiveau(progression.niveau);
                setExperience(progression.experience);
                setExperiencePourNiveauSuivant(progression.experiencePourNiveauSuivant);
            })
            .catch((err) => console.error("Erreur lors du chargement de la progression :", err));
    }, []);

    // Mettre à jour le statut du challenge et la progression
    const handleValidate = (id, exp) => {
        // Valider le challenge
        fetch(`http://localhost:5000/api/challenges/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ validé: true }),
        })
            .then((res) => res.json())
            .then(({ progression, expGagnee }) => {
                // Mettre à jour les challenges validés
                setChallenges(
                    challenges.map((ch) =>
                        ch.id === id ? { ...ch, validé: true } : ch
                    )
                );
                // Ajouter l'expérience gagnée et mettre à jour la progression de l'utilisateur
                setExpGagnee(expGagnee);
                setTimeout(() => setExpGagnee(0), 3000); // Effacer l'EXP gagnée après un délai

                // Mettre à jour les données utilisateur
                setNiveau(progression.niveau);
                setExperience(progression.experience);
                setExperiencePourNiveauSuivant(progression.experiencePourNiveauSuivant);
            })
            .catch((err) => console.error("Erreur validation challenge:", err));
    };

    // Calcul de la progression (en %) avec validation des valeurs
    const progression = experience && experiencePourNiveauSuivant
        ? Math.floor((experience / experiencePourNiveauSuivant) * 100)
        : 0;  // Éviter NaN si l'une des valeurs est invalide

    return (
        <div className="challenges-container">
            <h2 className="color-white">Défis physiques</h2>

            {/* Affichage du niveau et barre de progression */}
            <div className="level-container">
                <h3 className="color-white">Niveau {niveau}</h3>
                <ProgressBar progress={progression} />
            </div>

            {expGagnee > 0 && (
                <div className="exp-gagnee">+{expGagnee} EXP gagnée 🎉</div>
            )}

            <table className="challenges-table">
                <thead>
                <tr>
                    <th>Nom du challenge</th>
                    <th>Description</th>
                    <th>EXP</th>
                    <th>Statut</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {challenges.map((challenge) => (
                    <tr className="color-white" key={challenge.id}>
                        <td>{challenge.nom}</td>
                        <td>{challenge.description}</td>
                        <td>{challenge.exp}</td>
                        <td>{challenge.validé ? "Validé" : "Non validé"}</td>
                        <td>
                            {!challenge.validé && (
                                <button
                                    className="validate-button"
                                    onClick={() => handleValidate(challenge.id, challenge.exp)}
                                >
                                    Validé
                                </button>
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Challenges;
