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

   /** Post Login */
   app.post('/login',userModuel.login)

    /** Get LogOut  */
    app.get('/logout',userModuel.logout)
    
};