const service=require('./service')
class UserModuel {
  /**
   * GET Login
   */
  login(req, res) {
  const {email,password}=req.body;

// Get User From Db By Email
var user={};

    res.redirect('/')
  }

  /**
   * GET Register
   */
  register(req, res) {
    const {email,password}=req.body;

 //Check If Email Is Aleady Used
 if(true)
 {
    res.flas('Email Is Already Used');
    return
 }

 //Encrypt Password
 password=service.encrypt_password(password);

    res.redirect('/')
  }
}

//Export New User Module Inctance
module.exports = new UserModuel();
