import User from '../dao/dbManagers/models/users.model.js';

export const userPremium = async (req, res) => {
// Obtener el ID del usuario de los parámetros de ruta
const userId = req.params.id;

// Buscar al usuario en la base de datos por su ID
const user = await User.findById(userId);

// Verificar si el usuario existe en la base de datos
if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
}

// Verificar si el usuario tiene rol de admin
if (user.role === 'admin') {
    return res.status(403).json({ message: 'Solo los usuarios con rol user pueden cambiar a premium' });
}

// Cambiar el rol del usuario
user.role = user.role === 'user' ? 'premium' : 'user';
await user.save();

// Enviar respuesta al cliente
res.json({ message: `El rol del usuario ha sido cambiado a ${user.role}` });
};