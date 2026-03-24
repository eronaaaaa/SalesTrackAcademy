const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

const formatUser = (user) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  name: user.name,
});

exports.register = async (req, res) => {
  try {
    const { email, password, name, courseId } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: { email, password: hashedPassword, name, role: "AGENT" },
      });

      if (courseId) {
        await tx.assignment.create({
          data: {
            userId: newUser.id,
            courseId: parseInt(courseId),
            status: "IN_PROGRESS",
          },
        });
      }

      return newUser;
    });

    res.status(201).json({ token: signToken(user), user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ error: "Registration failed", message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({ token: signToken(user), user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ error: "Login failed", message: error.message });
  }
};