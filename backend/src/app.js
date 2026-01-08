import express from 'express'
import morgan from 'morgan'
import './database'
import playerRoutes from './routes/player.routes'
import loginDailyRoutes from './routes/loginDaily.routes'
import loginsPorFechaRoutes from './routes/logingPorFecha.routes'
import smsRoutes from "./routes/sms.routes"


const app = express();
const cors = require('cors');
app.use(express.json({ limit: "2mb" })); // ajusta lo necesario
app.use(express.urlencoded({ extended: true, limit: "2mb" }));
app.use(morgan('dev'))


app.use(cors()); 
app.use('/player', playerRoutes)
app.use('/count', loginDailyRoutes )
app.use('/logins', loginsPorFechaRoutes)
app.use('/sendsms', smsRoutes)


app.get('/', (req, res) => {
    res.json('Welcome')
})
export default app