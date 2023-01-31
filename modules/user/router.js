/**
 * 
 * @param {Express} app 
 */
var userModuel=require('./module')
module.exports= app=>{

    /** Get Login  */
    app.get('/login',(req,res) => res.render('user/login'))
    
    /** Post Login */
    app.post('/login',userModuel.login)



    /** Get Register  */
    app.get('/register',(req,res) => res.render('user/register'))
    
};