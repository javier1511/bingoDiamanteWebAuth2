import LoginDaily from "../models/LoginDaily.js";

export const getLoginsByDay = async (req, res) => {
  try {

    const { fecha } = req.query;

    if (!fecha) {
      return res.status(400).json({ message: "Debes enviar la fecha" });
    }

    const logins = await LoginDaily.find({ loginDate: fecha });

    if (logins.length === 0) {
      return res.json({ message: "No hay logins en esa fecha" });
    }

    return res.json(logins);

  } catch (error) {
    console.error("Error en getLoginsByDay:", error);
    return res.status(500).json({ message: "Error del servidor" });
  }
};
    