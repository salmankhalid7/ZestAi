const express = require("express");
const connectDB = require("./config/db");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const chatRoutes = require("./routes/chatRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");
const quizRoutes = require("./routes/quizRoutes");
const smartSearchRoutes = require("./routes/smartSearchRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const userRoutes = require("./routes/userRoutes");
const summaryRoutes = require("./routes/summaryRoutes"); // ✅ ADD THIS

require("dotenv").config();

connectDB();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, 
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/passport");
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/uploads", express.static("uploads", {
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "http://localhost:5173");
    res.set("Access-Control-Allow-Methods", "GET");
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));

app.use("/api/user", userRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/quiz", quizRoutes);
app.use("/api/flashcards", flashcardRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/summary", summaryRoutes); // ✅ ADD THIS
app.use("/auth", require("./routes/googleAuthRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/documents", require("./routes/documentRoutes"));
app.use("/api/search", smartSearchRoutes);

app.get("/", (req, res) => {
  res.send("API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});