import express from "express";
import dotenv from "dotenv";
import { pool } from "./db.js";

dotenv.config();
const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ mensaje: "API CRUD de estudiantes funcionando", endpoints: "/api/estudiantes" });
});

// listar estudiantes
app.get("/api/estudiantes", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM estudiantes ORDER BY id");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "No se pudo consultar la base de datos" });
  }
});

// consultar por ID
app.get("/api/estudiantes/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM estudiantes WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "Estudiante no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al consultar estudiante" });
  }
});

// crear estudiante
app.post("/api/estudiantes", async (req, res) => {
  const { nombre, correo, carrera } = req.body;
  if (!nombre || !correo || !carrera) {
    return res.status(400).json({ error: "nombre, correo y carrera son obligatorios" });
  }
  try {
    const [result] = await pool.query(
      "INSERT INTO estudiantes (nombre, correo, carrera) VALUES (?, ?, ?)",
      [nombre, correo, carrera]
    );
    res.status(201).json({ id: result.insertId, nombre, correo, carrera });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "El correo ya existe" });
    res.status(500).json({ error: "No se pudo crear el estudiante" });
  }
});

// actualizar estudiante
app.put("/api/estudiantes/:id", async (req, res) => {
  const { nombre, correo, carrera } = req.body;
  if (!nombre || !correo || !carrera) {
    return res.status(400).json({ error: "nombre, correo y carrera son obligatorios" });
  }
  try {
    const [result] = await pool.query(
      "UPDATE estudiantes SET nombre = ?, correo = ?, carrera = ? WHERE id = ?",
      [nombre, correo, carrera, req.params.id]
    );
    if (!result.affectedRows) return res.status(404).json({ error: "Estudiante no encontrado" });
    res.json({ mensaje: "Estudiante actualizado" });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") return res.status(409).json({ error: "El correo ya existe" });
    res.status(500).json({ error: "No se pudo actualizar el estudiante" });
  }
});

// eliminar estudiante
app.delete("/api/estudiantes/:id", async (req, res) => {
  try {
    const [result] = await pool.query("DELETE FROM estudiantes WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "Estudiante no encontrado" });
    res.json({ mensaje: "Estudiante eliminado" });
  } catch (error) {
    res.status(500).json({ error: "No se pudo eliminar el estudiante" });
  }
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => console.log(`API activa en puerto ${port}`));
