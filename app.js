const express = require("express");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const path = require("path");
const { Pool } = require("pg");
const app = express();

// For security
const bcrypt = require("bcrypt");
require('dotenv').config();
const helmet = require("helmet");
const cors = require("cors");

// Middlewares
app.use(helmet());
app.use(cors({
    origin: "https://reycademy.netlify.app",
    credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Database setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
  }
});

// Session setup
app.use(session({
    store: new pgSession({ 
        pool: pool,
        tableName: 'session',   
        schemaName: 'public'
     }),

    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie: {
        httpOnly: true,         
        secure: true,          
        sameSite: "none",    
        maxAge: 1000 * 60 * 60
    }
}));

function servePage(fileName) {
    return (req, res) => { res.sendFile(path.join(__dirname, "public", fileName)); };
};

async function hashedPassword (plainPassword) {
    return await bcrypt.hash(plainPassword, 10);
};

async function comparePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

// Routes
app.get("/login", servePage("login.html"));
app.get("/signup", servePage("signup.html"));

// For signup
app.post("/register", async (req, res) => {
    const { firstName, lastName, username, password, confirmPassword } = req.body;

    try {
        // The password hash
        const hash = await hashedPassword(confirmPassword);

        if (password === confirmPassword) {     
            await pool.query("INSERT INTO public.reycademy_users(firstname, lastname, username, password) VALUES($1, $2, $3, $4)", [firstName, lastName, username, hash]);
            res.json({ registered : true });
        } else  {
            res.status(401).json({registered : false, message : "Pasword & Confirm Password are not same"});
        }
        
    } catch (err) {
        res.status(500).json({ registered:   false, message: "Internal Server Error" });
        console.log(err);
    };

});

// For login
app.post("/submit", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT password FROM public.reycademy_users WHERE username = $1", [username]);

        if (result.rowCount === 0) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }   
        
        const storedHash = result.rows[0].password;
        const match = await comparePassword(password, storedHash);

        if (match) {
            req.session.user = { username };
            req.session.save(err => {
                if (err) {
                    console.error("Session save error:", err);
                    return res.status(500).json({ success: false, message: "Could not save session" });
                }
                res.json({ success: true }); 
            });
            // res.json({ success: true });
        } else {
            res.status(401).json({ success: false, message: "Invalid username or password" });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});

// For logout
app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Logout failed" });
    }

    res.clearCookie("connect.sid"); // Clear cookie after session is gone
    return res.json({ success: true, message: "Logged out successfully" });
    });
});

// For session
app.post('/session', (req, res) => {
    if (req.session.user) {
    res.json({
        loggedIn: true,
        username: req.session.user.username
    });
    } else {
    res.json({ loggedIn: false });
    }
});

app.use((req, res) => {
    res.status(404).send("<h1>Page Not Found(404)</h1>");
});

app.use((req, res) => {
    res.status(500).json({ success: false, message: "Internal Server Error" });
});


const PORTs = process.env.PORT || 3000;

app.listen(PORTs, () => {
    console.log("Server is running...");
}); 