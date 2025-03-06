const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Fichier JSON des exercices
const exercicesFilePath = path.join(__dirname, "data", "exercices.json");
// Lire les exercices
app.get("/api/exercices", (req, res) => {
    fs.readFile(exercicesFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du fichier" });
        }
        res.json(JSON.parse(data));
    });
});

// Ajouter un nouvel exercice
app.post("/api/exercices", (req, res) => {
    const newExercice = req.body;

    fs.readFile(exercicesFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du fichier" });
        }

        const exercices = JSON.parse(data);
        newExercice.id = exercices.length + 1; // Générer un nouvel ID
        exercices.push(newExercice);

        fs.writeFile(exercicesFilePath, JSON.stringify(exercices, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Erreur d'écriture dans le fichier" });
            }
            res.status(201).json(newExercice);
        });
    });
});

// Modifier un exercice (mettre à jour le PR)
app.put("/api/exercices/:id", (req, res) => {
    const exerciceId = parseInt(req.params.id); // Récupérer l'ID de l'exercice à modifier
    const { PR } = req.body; // Récupérer la nouvelle valeur du PR

    fs.readFile(exercicesFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du fichier" });
        }

        const exercices = JSON.parse(data);
        const exerciceIndex = exercices.findIndex((ex) => ex.id === exerciceId);

        if (exerciceIndex === -1) {
            return res.status(404).json({ error: "Exercice non trouvé" });
        }

        // Mettre à jour le PR de l'exercice trouvé
        exercices[exerciceIndex].PR = PR;

        fs.writeFile(exercicesFilePath, JSON.stringify(exercices, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Erreur d'écriture dans le fichier" });
            }
            res.status(200).json(exercices[exerciceIndex]); // Retourner l'exercice mis à jour
        });
    });
});

// Fichier JSON des séances
const seancesFilePath = path.join(__dirname, "data", "seances.json");

// Récupérer les séances
app.get("/api/seances", (req, res) => {
    fs.readFile(seancesFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du fichier des séances" });
        }
        try {
            const seances = JSON.parse(data); // Assurer que le fichier JSON est bien valide
            res.json(seances); // Retourner les séances sous forme JSON
        } catch (parseError) {
            console.error("Erreur de parsing JSON:", parseError);
            return res.status(500).json({ error: "Erreur de parsing des séances" });
        }
    });
});


// Fichier JSON du calendrier
const calendarFilePath = path.join(__dirname, "data", "calendar.json");

// Récupérer les données du calendrier
app.get("/api/calendar", (req, res) => {
    fs.readFile(calendarFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du calendrier" });
        }
        res.json(JSON.parse(data));
    });
});

// Enregistrer une nouvelle séance dans le calendrier
app.post("/api/calendar", (req, res) => {
    const newEntry = req.body; // { date: '2025-01-05', seanceId: 1, color: '#ff5733' }

    fs.readFile(calendarFilePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture du calendrier" });
        }

        let calendarData = JSON.parse(data);

        // Remplacer ou ajouter l'entrée pour cette date
        calendarData = calendarData.filter((entry) => entry.date !== newEntry.date);
        calendarData.push(newEntry);

        fs.writeFile(calendarFilePath, JSON.stringify(calendarData, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Erreur d'écriture dans le calendrier" });
            }
            res.status(201).json(newEntry);
        });
    });
});

// Récupérer les challenges
app.get("/api/challenges", (req, res) => {
    fs.readFile(path.join(__dirname, "data", "challenges.json"), "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture des challenges" });
        }
        res.json(JSON.parse(data));
    });
});

// Mettre à jour le statut d'un challenge et gérer l'expérience
app.put("/api/challenges/:id", (req, res) => {
    const { id } = req.params;
    const { validé } = req.body;

    fs.readFile(path.join(__dirname, "data", "challenges.json"), "utf8", (err, data) => {
        if (err) {
            return res.status(500).json({ error: "Erreur de lecture des challenges" });
        }

        const challenges = JSON.parse(data);
        const challenge = challenges.find((ch) => ch.id === parseInt(id));

        if (!challenge) {
            return res.status(404).json({ error: "Challenge non trouvé" });
        }

        // Mettre à jour le statut du challenge
        challenge.validé = validé;

        // Sauvegarder les challenges mis à jour
        fs.writeFile(path.join(__dirname, "data", "challenges.json"), JSON.stringify(challenges, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: "Erreur d'écriture dans le fichier des challenges" });
            }

            // Lire la progression de l'utilisateur
            fs.readFile(path.join(__dirname, "data", "progression.json"), "utf8", (err, data) => {
                if (err) {
                    return res.status(500).json({ error: "Erreur de lecture de la progression" });
                }

                let progression = JSON.parse(data);

                // Ajouter l'expérience du challenge validé à l'expérience de l'utilisateur
                progression.experience += challenge.exp;

                // Vérifier si l'utilisateur a atteint un nouveau niveau
                while (progression.experience >= progression.experiencePourNiveauSuivant) {
                    progression.experience -= progression.experiencePourNiveauSuivant;
                    progression.niveau++;
                    progression.experiencePourNiveauSuivant = Math.floor(progression.experiencePourNiveauSuivant * 1.5);
                }

                // Sauvegarder la progression mise à jour dans le fichier
                fs.writeFile(path.join(__dirname, "data", "progression.json"), JSON.stringify(progression, null, 2), (err) => {
                    if (err) {
                        return res.status(500).json({ error: "Erreur de sauvegarde de la progression" });
                    }

                    // Retourner la réponse avec le challenge mis à jour et la progression de l'utilisateur
                    res.status(200).json({
                        challenge,
                        progression
                    });
                });
            });
        });
    });
});

// API pour obtenir la progression
app.get("/api/progression", (req, res) => {
    fs.readFile(path.join(__dirname, "data", "progression.json"), "utf8", (err, data) => {
        if (err) {
            console.error("Erreur de lecture de la progression :", err);
            return res.status(500).json({ error: "Erreur de lecture du fichier progression" });
        }

        try {
            const progression = JSON.parse(data);
            res.json(progression); // Renvoie les données de progression sous forme d'objet
        } catch (parseError) {
            console.error("Erreur de parsing JSON:", parseError);
            return res.status(500).json({ error: "Erreur de parsing des données progression" });
        }
    });
});



// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
});
