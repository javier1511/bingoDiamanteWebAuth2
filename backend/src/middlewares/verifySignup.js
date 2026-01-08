import Player from "../models/Player.js";



export const checkDuplicateUsername = async (req, res, next) => {
    try {

        const user = await  Player.findOne({mobile: req.body.mobile})
        if(user){
            return res.status(400).json({message: 'Usuario ya existe'})
        }

        return next();
        
    } catch (error) {
            console.error("Error en checkDuplicateUsername:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
        
    }
}
