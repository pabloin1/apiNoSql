const Usuario = require('../modules/usuario')

const existeEmial = async(correo ='') =>{
   const emailExiste = await Usuario.findOne({correo});

    if (emailExiste) {
        throw new Error(`El correo ${correo}, ya existe`)
    }
}

module.exports ={
    existeEmial
}