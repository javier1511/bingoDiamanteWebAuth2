import {Schema, model} from 'mongoose'


const playerSchema =  new Schema({
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true,
    },
    registroFecha:{
        type:Date,
        required:true
    },
    registroHora:{
        type:String,
        required:true
    }


})


export default model('Player', playerSchema)