exports.getuser = (req,res) => {
    return res.status(200).json([{"id":1,"nombre":"Richardd","correo":"vendedor11@gmail.com","contrasena":"pass123"}]);
}

exports.getUserById