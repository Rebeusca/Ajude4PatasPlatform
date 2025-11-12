const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");

dotenv.config();
const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

// rota protegida de exemplo
app.get("/api/secure", authMiddleware, (req, res) => {
  res.json({ message: "Acesso autorizado!", user: req.user });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
