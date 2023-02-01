const service = require('./service')
const joi = require('joi')

class UserModuel {
  /**
   * GET Login
   */
  async login(req, res) {
    var validate = joi.object().keys({
      email: joi.string().email.required(),
      password: joi.string().required(),
    }).validate(req.body);

    //Check From 
    if (validate.error) {
      console.log('Register Error:', validate.error);
      return res.flash('error', 'Please Enter Full Information');
    }

    var connection = await db.getConnection();

    // Get User From Db By Email
    var user = await connection.execute(`select * from users where email='${validate.value.email}'`);

    //Cehck If Not Found
    if (!user) {
      return res.flash('error', 'Invalid Email Or Password');
    }

    //Check From Password
    if (service.compare_passwords(validate.validate.password, user.Password)) {
      return res.flash('error', 'Invalid Email Or Password');
    }


    //Login 
    req.session.userId = user.Id;
    return req.session.save(() => {
      //Redirect To Home
      return res.redirect("/");
    });
  }

  /**
   * GET Register
   */
  async register(req, res) {

    var validate = joi.object().keys({
      email: joi.string().email.required(),
      userName: joi.string().required(),
      password: joi.string().required(),
      userType: joi.string().required()
    }).validate(req.body);

    //Check From 
    if (validate.error) {
      console.log('Register Error:', validate.error);
      return res.flash('error', 'Please Enter Full Information');
    }

    var connection = await db.getConnection();

    //Check If Email Is Aleady Used
    if ((await connection.execute(`select count(id) from users where email='${validate.value.email}'`)) > 0) {
      res.flash('error', 'Email Is Already Used');
      return
    }

    //Check If User Name Is Aleady Used
    if ((await connection.execute(`select count(id) from users where username='${validate.value.userName}'`)) > 0) {
      res.flash('error', 'User Name Is Already Used');
      return
    }

    //Encrypt Password
    validate.value.password = service.encrypt_password(validate.value.password);

    //Insert User
    var user = await connection.execute(`insert users (email,username,usertype,password) values ('${validate.value.email}','${validate.value.userName}','${validate.value.userType}','${validate.value.password}')`)

    //Login 
    req.session.userId = user.Id;
    return req.session.save(() => {
      //Redirect To Home
      return res.redirect("/");
    });
  }

  /**
   * Logout
   */
  async logout(req, res) {
    //Login 
    delete req.session.userId;
    return req.session.save(() => {
      //Redirect To Home
      return res.redirect("/");
    });
  }

}

//Export New User Module Inctance
module.exports = new UserModuel();
