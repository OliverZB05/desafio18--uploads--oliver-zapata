const LogTests = async (req, res, levels) => {
    levels.forEach(level => {
        req.logger(req, level, `mensaje de ${level}`);
    });
    res.send('Prueba de logs completada');
}

export { LogTests };
