import { Router } from 'express';

const router = Router();

//Acceso público y privado
const publicAccess = (req, res, next) => {
    next();
}

const privateAccess = (req, res, next) => {
    if(!req.session.user) return res.redirect('/login');
    next();
}

router.get('/register', publicAccess, (req, res) => {
    res.render('register');
});

router.get('/reset', publicAccess, (req, res) => {
    res.render('reset');
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login');
});

router.get('/', publicAccess, (req, res) => {
    res.render('login');
});

router.get('/ResetPassword', publicAccess, (req, res) => {
    res.render('ResetPassword');
});

router.get('/new-reset', publicAccess, (req, res) => {
    res.render('new-reset');
});


router.get('/chat', (req, res, next) => {
    //======={ TDD }=======
    // 1. Identificar que si el usuario de inicio sesión o no
    if(!req.session.viewedProducts) { //viewedProducts detecta si el usuario a pasado antes por la vista de productos
        req.logger(req, 'error', 'El usuario debe iniciar sesión para entrar al chat');
        return res.redirect('/login');
    }
    //======={ TDD }=======

    next();
}, (req, res) => {
    res.render("chat", { role: req.session.user.role });
});

export default router;