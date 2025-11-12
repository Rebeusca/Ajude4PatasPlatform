const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const { PrismaClient } = require('../../generated/prisma');
require("dotenv").config();
     
const prisma = new PrismaClient();


const register = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing){
        return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    const hashed = await bcrypt.hash(senha, 10);

    const newUser = await prisma.admin.create({
      data: { nome, email, senha: hashed },
    });

    // Gera segredo e QR Code 2FA
    const secret = speakeasy.generateSecret({ name: `Sistema (${email})` });
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

    await prisma.admin.update({
      where: { id: newUser.id },
      data: { twoFactorSecret: secret.base32 },
    });

    res.json({
      message: "Usuário registrado com sucesso",
      qrCodeUrl,
      info: "Escaneie o QR Code no Google Authenticator ou Authy",
    });
  } catch (err) {
    res.status(500).json({ error: "Erro no registro", details: err.message });
  }
};

// 🔐 Login (email + senha + token 2FA)
const login = async (req, res) => {
  try {
    const { email, senha, token2FA } = req.body;

    const user = await prisma.admin.findUnique({ where: { email } });
    if (!user){
        return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const validPassword = await bcrypt.compare(senha, user.senha);
    if (!validPassword){
        return res.status(401).json({ error: "Senha incorreta" });
    }

    if (!user.twoFactorSecret){
        return res.status(401).json({ error: "2FA não configurado para este usuário." });
    }

    const valid2FA = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token2FA,
      window: 1,
    });

    if (!valid2FA){
        return res.status(401).json({ error: "Código 2FA inválido." });
    }

    // Gera token JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      message: "Login bem-sucedido",
      token,
      user: { id: user.id, nome: user.nome, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ error: "Erro no login", details: err.message });
  }
};

// 🚪 Logout (cliente apenas descarta o token)
const logout = async (req, res) => {
  res.json({ message: "Logout realizado. Invalide o token no cliente." });
};

module.exports = {
  register,
  login,
  logout,
};