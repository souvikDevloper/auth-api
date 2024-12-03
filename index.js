const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const users = []; // This will hold users temporarily (use a database in real apps)

const SECRET_KEY = "yourSecretKey"; // Use a secure key in production

// Middleware to parse incoming JSON requests
app.use(express.json());

// Register route
app.post("/register", async (req, res) => {
    console.log("Request Body:", req.body); // Debugging log

    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        console.error("Missing fields in request body");
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Store the user (replace with database logic in real apps)
        users.push({ username, password: hashedPassword });

        console.log("User registered successfully:", { username });

        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Login route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    const user = users.find((u) => u.username === username);
    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Compare password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
});

// Protected route
app.get("/protected", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; // Extract token from "Bearer <token>"

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        res.status(200).json({ message: "Access granted", user: decoded });
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
