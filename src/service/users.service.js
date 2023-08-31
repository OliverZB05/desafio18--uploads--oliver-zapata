import User from '../dao/dbManagers/models/users.model.js';
import { __dirname } from "../utils.js";
import fs from 'fs';
import path from 'path';

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

// Verificar si el usuario tiene los documentos requeridos
const missingDocuments = [];
if (!user.documents.some(doc => doc.name === 'Identificacion')) {
missingDocuments.push('Identificacion');
}
if (!user.documents.some(doc => doc.name === 'Comprobante de domicilio')) {
missingDocuments.push('Comprobante de domicilio');
}
if (!user.documents.some(doc => doc.name === 'Comprobante de estado de cuenta')) {
missingDocuments.push('Comprobante de estado de cuenta');
}

if (missingDocuments.length > 0) {
return res.status(400).json({ message: `No se puede actualizar al usuario a premium porque le faltan los siguientes documentos: ${missingDocuments.join(', ')}` });
}

// Cambiar el rol del usuario
user.role = user.role === 'user' ? 'premium' : 'user';
await user.save();

// Enviar respuesta al cliente
res.json({ message: `El rol del usuario ha sido cambiado a ${user.role}` });
};


export const uploadDocuments = async (req, res) => {
    // Obtener el ID del usuario de los parámetros de ruta
    const userId = req.params.id;

    // Buscar al usuario en la base de datos por su ID
    const user = await User.findById(userId);

    // Verificar si el usuario existe en la base de datos
    if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Procesar los archivos cargados
    for (const fieldName in req.files) {
        for (const file of req.files[fieldName]) {
            // Extraer el nombre del archivo sin la extensión
            const fileName = path.parse(file.originalname).name;

            // Agregar documento al usuario
            user.documents.push({
                name: fileName,
                reference: file.path.replace(__dirname, '')
            });

            // Renombrar el archivo
            const oldPath = file.path;
            const newPath = oldPath.replace(file.filename, file.originalname);
            fs.rename(oldPath, newPath, err => {
                if (err) throw err;
            });
        }
    }

    // Guardar cambios en el modelo de usuario
    await user.save();

    // Enviar respuesta al cliente
    res.json({ message: 'Documentos cargados con éxito' });
};