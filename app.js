const express = require("express");
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const path = require("path");
const { Pool } = require("pg");
const app = express();

// For security
const rateLimit = require('express-rate-limit');
const bcrypt = require("bcrypt");
require('dotenv').config();
const helmet = require("helmet");
const cors = require("cors");

// Trust first proxy because I'm using Render.com
app.set("trust proxy", 1);

// Middlewares
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests only per window per IP
  handler: (req, res) => {
    // Custom response when rate limit(5 requests) exceeded
    res.status(429).json({ success: false, message: 'Too many login attempts. Try again later.' });
  }
});

app.use(helmet({

    xssFilter: false, // I disable because it's deprecated and I use CSP instead

    // For XSS protection
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],   
            scriptSrc:  ["'self'", "https://reycademy.onrender.com"],
            connectSrc: ["'self'", "https://reycademy.onrender.com"],
            styleSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://cdnjs.cloudflare.com"],
            frameSrc: ["'self'", "https://www.youtube.com"]

            // The rest directives will use the default value 'self'
        },
    },

    // For clickjacking protection
    xFrameOptions: { 
        action: "deny" // I don't want my site to be framed even in my own site
    },

    // For HTTPS downgrading and MITM in HTTP protection
    hsts: {
        maxAge: 31536000, // 1 year expiration (31,536,000 in seconds)
        includeSubDomains: false, // I don't have subdomains
        preload: false // I don't want to be included in browsers preload list
    },

    // For referrer information leak protection
    referrerPolicy: {
        policy: "strict-origin-when-cross-origin" // Only send full URL referrer when the origin is same
    },

    // For external resources that can be only embedded in my site if it provide CORP: cross-origin
    crossOriginEmbedderPolicy: { 
        policy: "require-corp" 
    }
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Permissions-Policy", "geolocation=(), camera=(), microphone=(), fullscreen=(self \"https://www.youtube.com\")"
  );
  next();
});

app.use(cors({
    origin: "https://reycademy.netlify.app",
    credentials: true, 
    methods: ["GET", "POST", "PUT"] // These are only allowed methods that my site will use
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public"), {
    // Cache static files for 7 days so it don't always redownload
    setHeaders: (res, path) => {
      res.setHeader("Cache-Control", "public, max-age=604800, immutable");
    }
}));

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
        httpOnly: true, // This prevent client side JS to access the cookie(example: document.cookie)
        secure: true, // This only send the cookie over HTTPS
        sameSite: "none",  // My frontend and backend are on different origin so I need to use 'none'
        maxAge: 1000 * 60 * 60 // (1000 * 60 = 60,000(1 minute ms)) * 60 = 3,600,000(60 minutes ms = 1 hour expiration)
    }
}));

// Helper functions
function servePage(fileName) {
    return (req, res) => { 
        // Don't cache because It's sensitive pages
        res.set("Cache-Control", "no-store");
        res.sendFile(path.join(__dirname, "public", fileName)); 
    };
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
app.post("/submit", loginLimiter, async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query("SELECT password FROM public.reycademy_users WHERE username = $1", [username]);

        if (result.rowCount === 0) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }   
        
        const storedHash = result.rows[0].password;
        const match = await comparePassword(password, storedHash);

        if (match) {
            req.session.user = { username : username };
            res.json({success: true});
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

    res.clearCookie("connect.sid");
    return res.json({ success: true, message: "Logged out successfully" });
    });
});

// For session
app.post('/session', async (req, res) => {
    if (req.session.user) {
        // Grab termsAccepted in db
        const result = await pool.query("SELECT terms_accepted FROM public.reycademy_users WHERE username = $1", [req.session.user.username]); 

        // If user not found, default to false
        const termsAccepted = result.rows[0]?.terms_accepted || false;
        res.json({
            loggedIn: true,
            username: req.session.user.username,
            termsAccepted: termsAccepted // true or false
        });
    } else {
        res.json({ loggedIn: false });
    }
});

app.post('/accept-terms', async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: "Not logged in" });
    }
    try {
        await pool.query("UPDATE public.reycademy_users SET terms_accepted = TRUE WHERE username = $1", [req.session.user.username]);
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Internal Server Error" });
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