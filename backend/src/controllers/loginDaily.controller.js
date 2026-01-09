  // controllers/loginDaily.controller.js
  import mongoose from "mongoose";
  import LoginDaily from "../models/LoginDaily.js";

  export const countLoginsByRange = async (req, res) => {
    try {
      const { fechaInicio, fechaFin, playerId } = req.query;

      if (!fechaInicio || !fechaFin) {
        return res.status(400).json({
          message: "fechaInicio y fechaFin son requeridas",
        });
      }

      // Rango en fechas (día completo)
      const startDate = new Date(fechaInicio);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(fechaFin);
      endDate.setHours(23, 59, 59, 999);

      const match = {
        loginAt: { $gte: startDate, $lte: endDate },
      };

      // filtro opcional por jugador (CAST a ObjectId)
      if (playerId) {
        if (!mongoose.Types.ObjectId.isValid(playerId)) {
          return res.status(400).json({ message: "playerId inválido" });
        }
        match.player = new mongoose.Types.ObjectId(playerId);
      }

      const porDia = await LoginDaily.aggregate([
        { $match: match },
        {
          $addFields: {
            fecha: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$loginAt",
                timezone: "America/Mexico_City",
              },
            },
          },
        },
        {
          $group: {
            _id: "$fecha",
            totalLogins: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        {
          $project: {
            _id: 0,
            fecha: "$_id",
            totalLogins: 1,
          },
        },
      ]);

      const totalLoginsRango = porDia.reduce(
        (acc, dia) => acc + dia.totalLogins,
        0
      );

      return res.status(200).json({
        fechaInicio,
        fechaFin,
        playerId: playerId || null,
        totalLoginsRango,
        porDia,
      });
    } catch (error) {
      console.error("Error en countLoginsByRange:", error);
      return res.status(500).json({ message: "Error al contar logins" });
    }
  };
