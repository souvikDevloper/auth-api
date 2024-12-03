const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

const PORT = 3000;
const JWT_SECRET = "your_jwt_secret_key";

// Middleware to parse JSON
app.use(express.json());

// Register Route
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the database
        const user = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        if (error.code === "P2002") {
            res.status(400).json({ message: "Username already exists" });
        } else {
            res.status(500).json({ message: "Internal server error", error: error.message });
        }
    }
});

// Login Route
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        // Find user in the database
        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid username or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
            expiresIn: "1h",
        });

        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Protected Route
app.get("/protected", (req, res) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ message: "Protected content accessed", user: decoded });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
