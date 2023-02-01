/**
 * 
 * @param {Express} app 
 */
var userModuel = require('./module')
module.exports = app => {
    /** Get Login  */
    app.get('/login', (req, res) => res.render('users/login'))

    /** Get Register  */
    app.get('/register', (req, res) => res.render('users/register'))

    /** Post Login */
    app.post('/login', userModuel.login)

    /** Post Login */
    app.post('/register', userModuel.register)

    /** Get LogOut  */
    app.get('/logout', userModuel.logout)
};