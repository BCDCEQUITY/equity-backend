// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json()); // bodyParser non nécessaire

// Connexion à MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connecté'))
.catch(err => console.error('❌ Erreur MongoDB:', err));

// Schéma utilisateur
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Route POST /login pour enregistrer un utilisateur
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    try {
        // Vérifie si l'utilisateur existe déjà
        let existingUser = await User.findOne({ email });
        if(existingUser) return res.status(409).json({ message: 'Utilisateur déjà enregistré' });

        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

// Route GET simple
app.get('/', (req, res) => res.send('Backend Equity en ligne !'));

app.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
