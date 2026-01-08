import Player from '../models/Player.js'
import LoginDaily from "../models/LoginDaily.js";


export const getPlayer = async (req, res) => {
  try {
    const players = await Player.find().lean();

    if (!players || players.length === 0) {
      return res.json([]);
    }

    const playersWithTotals = [];

    for (const player of players) {
      const totalLogins = await LoginDaily.countDocuments({
        player: player._id,
      });

      playersWithTotals.push({
        _id: player._id,
        mobile: player.mobile,
        name: player.name,
        registroFecha: player.registroFecha,
        registroHora: player.registroHora,
        totalLogins: totalLogins,
      });
    }

    return res.status(200).json(playersWithTotals);
  } catch (error) {
    console.error("Error en getPlayer", error);
    return res
      .status(500)
      .json({ message: "Error al obtener jugadores del servidor" });
  }
};
export const createPlayer = async (req, res) => {
    try {

        const{mobile, name, registroFecha, registroHora} = req.body
        const newPlayer = new Player({mobile, name, registroFecha, registroHora})
        const playerSave = newPlayer.save();
        return res.status(201).json(playerSave)


        
    } catch (error) {
           console.error("Error en createPlayer", error);
        return res.status(500).json({message: "Error al crear imagen en el servidor"})
        
    }
}



const TZ = "America/Mexico_City";

const getToday = () =>
  new Date().toLocaleDateString("en-CA", { timeZone: TZ });

const getHour = () =>
  new Date().toLocaleTimeString("es-MX", {
    timeZone: TZ,
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const loginPlayer = async (req, res) => {
  try {
    const { player } = req.body;

    if (!player) {
      return res.status(400).json({
        message: "playerId es requerido",
      });
    }

    // 1️⃣ Buscar jugador por ID
    const foundPlayer = await Player.findById(player);

    if (!foundPlayer) {
      return res.status(404).json({
        message: "Jugador no encontrado",
      });
    }

    const today = getToday();
    const hour = getHour();

    // 2️⃣ Crear login diario
    try {
      await LoginDaily.create({
        player: foundPlayer._id,
        name: foundPlayer.name,
        mobile: foundPlayer.mobile,
        loginDate: today,
        loginHour: hour,
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          message: "El jugador ya hizo login hoy",
          data: {
            player: foundPlayer._id,
            name: foundPlayer.name,
            mobile: foundPlayer.mobile,
            loginDate: today,
          },
        });
      }
      throw error;
    }

    // 3️⃣ Respuesta
    return res.status(200).json({
      message: "Login registrado correctamente",
      data: {
        player: foundPlayer._id,
        name: foundPlayer.name,
        mobile: foundPlayer.mobile,
        loginDate: today,
        loginHour: hour,
      },
    });
  } catch (error) {
    console.error("Error en loginPlayer:", error);
    return res.status(500).json({
      message: "Error en el login",
    });
  }
};





export const getPlayerByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;

    const player = await Player.findOne({ mobile }).lean();
    if (!player) {
      return res.status(404).json({ message: "Jugador no encontrado" });
    }

    const totalLogins = await LoginDaily.countDocuments({ player: player._id });

    return res.status(200).json({
      ...player,
      totalLogins,
    });
  } catch (error) {
    console.error("error en getPlayerByMobile", error);
    return res.status(500).json({ message: "Error interno al buscar jugador" });
  }
};


export const updatePlayerById = async (req, res) => {
  try {

    const player = await Player.findByIdAndUpdate(req.params.playerId, req.body,{
      new:true
    });
    
    if(!player) {
      return res.json(404).json({error: "Jugador no encontrado"})
    }


    res.status(200).json(player)
    
  } catch (error) {

     console.error('Error en updatePlayerById', error);
    res.status(500).json({ error: 'Error al buscar la venta por id' });
    
  }
}