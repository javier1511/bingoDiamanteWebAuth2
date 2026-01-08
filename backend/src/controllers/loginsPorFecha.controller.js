// controllers/loginsPorFecha.controller.js
import LoginDaily from "../models/LoginDaily.js";

export const loginsPorFecha = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        message: "fechaInicio y fechaFin son requeridas (YYYY-MM-DD)",
      });
    }

    // como loginDate es string YYYY-MM-DD, comparar strings funciona perfecto
    const result = await LoginDaily.aggregate([
      { $match: { loginDate: { $gte: fechaInicio, $lte: fechaFin } } },
      { $group: { _id: "$loginDate", total: { $sum: 1 } } },
      { $sort: { _id: 1 } },
      { $project: { _id: 0, fecha: "$_id", total: 1 } },
    ]);

    return res.json(result);
  } catch (error) {
    console.error("Error en loginsPorFecha:", error);
    return res.status(500).json({ message: "Error al contar logins por fecha" });
  }
};
