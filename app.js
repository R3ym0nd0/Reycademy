const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const helmet = require("helmet");
const cors = require("cors");

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
    origin: "https://reycademy.netlify.app", // frontend domain
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Database setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// JWT secret & expiration
const JWT_SECRET = process.env.SESSION_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

// Serve HTML pages
function servePage(fileName) {
    return (req, res) => res.sendFile(path.join(__dirname, "public", fileName));
}

app.get("/login", servePage("login.html"));
app.get("/signup", servePage("signup.html"));

// Hashing helpers
async function hashedPassword(plain) {
    return await bcrypt.hash(plain, 10);
}
async function comparePassword(plain, hash) {
    return await bcrypt.compare(plain, hash);
}

// Signup
app.post("/register", async (req, res) => {
    const { firstName, lastName, username, password, confirmPassword } = req.body;
    try {
        if (password !== confirmPassword) return res.status(401).json({ registered: false, message: "Password & Confirm Password are not same" });

        const hash = await hashedPassword(confirmPassword);
        await pool.query(
            "INSERT INTO reycademy_users(firstname, lastname, username, password) VALUES($1,$2,$3,$4)",
            [firstName, lastName, username, hash]
        );
        res.json({ registered: true });
    } catch (err) {
        console.log(err);
        res.status(500).json({ registered: false, message: "Internal Server Error" });
    }
});

// Login → return JWT
app.post("/submit", async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query("SELECT password FROM reycademy_users WHERE username = $1", [username]);
        if (result.rowCount === 0) return res.status(401).json({ success: false, message: "Invalid username or password" });

        const match = await comparePassword(password, result.rows[0].password);
        if (!match) return res.status(401).json({ success: false, message: "Invalid username or password" });

        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        res.json({ success: true, token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        req.user = decoded;
        next();
    });
}

// Session check route
app.post("/session", verifyToken, (req, res) => {
    res.json({ loggedIn: true, username: req.user.username });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running..."));
