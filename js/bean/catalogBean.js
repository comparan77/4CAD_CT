//**Usuario */
var BeanUsuario = function(email, contrasenia) {
    this.Id = 0;
    this.Nombre = '';
    this.Clave = '';
    this.Email = email;
    this.Contrasenia = contrasenia;
    this.Id_bodega = 0;
    this.Id_rol = 0;
    this.IsActive = 0;
};

//**Personal QR Pivote */
var BeanPerQRPivote = function(idf, id_usuario) {
    this.Id = 0;
    this.Idf = idf;
    this.Id_usuario = id_usuario;
};

//**Personal foto */
var BeanPerFoto = function(foto, id_usuario) {
    this.Id = 0;
    this.Id_usuario = id_usuario;
    this.Foto = foto;
}
