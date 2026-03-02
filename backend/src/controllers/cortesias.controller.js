import Cortesias from "../models/Cortesias";
import mongoose from "mongoose";


export const createCortesia = async (req, res) => {
    try {

        const{player, name, mobile, loginDate, loginHour, cortesias} = req.body
        const newCortesia = new Cortesias({player, name, mobile, loginDate, loginHour, cortesias})
        const saveCortesia =  await newCortesia.save();
        return res.status(201).json(saveCortesia)
        
    } catch (error) {
            console.error("Error en createCortesia", error);
        return res.status(500).json({message: "Error al crear imagen en el servidor"})
    }
}

export const getCortesiasByPlayerId = async (req, res) => {
  try {

    const { playerId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(playerId)) {
      return res.status(400).json({ error: "Id inválido" });
    }

    const cortesias = await Cortesias.find({
      player: new mongoose.Types.ObjectId(playerId)
    });

    if (cortesias.length === 0) {
      return res.status(404).json({ error: "No hay cortesias para este jugador" });
    }

    res.status(200).json(cortesias);

  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al obtener las cortesias" });
  }
};




// GET /cortesias/resumen-por-dia?fechaInicio=2026-02-25&fechaFin=2026-02-27
export const getResumenCortesiasPorDia = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debes enviar fechaInicio y fechaFin" });
    }

    const resultado = await Cortesias.aggregate([
      {
        $match: {
          loginDate: { $gte: fechaInicio, $lte: fechaFin }
        }
      },
      {
        $group: {
          _id: "$loginDate",
          registros: { $sum: 1 },
          totalCortesias: { $sum: { $ifNull: ["$cortesias", 0] } },
          playersSet: { $addToSet: "$player" }
        }
      },
      {
        $project: {
          _id: 0,
          loginDate: "$_id",
          registros: 1,
          totalCortesias: 1,
          playersDistintos: { $size: "$playersSet" }
        }
      },
      { $sort: { loginDate: 1 } }
    ]);

    // ✅ Totales generales del rango
    let totalRegistros = 0;
    let totalCortesias = 0;
    const playersGlobal = new Set();

    resultado.forEach(dia => {
      totalRegistros += dia.registros;
      totalCortesias += dia.totalCortesias;
    });

    // Para players únicos globales
    const playersUnicosGlobal = await Cortesias.distinct("player", {
      loginDate: { $gte: fechaInicio, $lte: fechaFin }
    });

    return res.json({
      porDia: resultado,
      totales: {
        totalRegistros,
        totalCortesias,
        playersDistintos: playersUnicosGlobal.length
      }
    });

  } catch (error) {
    console.error("getResumenCortesiasPorDia:", error);
    return res.status(500).json({ error: "Error interno" });
  }
};