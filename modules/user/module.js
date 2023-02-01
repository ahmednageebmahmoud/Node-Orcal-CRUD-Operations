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
      req.flash('error', 'Please Enter Full Information');
      return res.redirect('/login')
    }

    //Connect To DB
    var connection = await db.getConnection();

    // Get User From Db By Email
    var user = await connection.execute(`select * from users where email='${validate.value.email}'`);

    //Cehck If Not Found
    if (!user) {
      req.flash('error', 'Invalid Email Or Password');
      return res.redirect('/login')
    }

    //Check From Password
    if (service.compare_passwords(validate.validate.password, user.Password)) {
      req.flash('error', 'Invalid Email Or Password');
      return res.redirect('/login')
    }


    //Login 
    req.session.userId = user.Id;
    return req.session.save(async () => {
      await connection.excute(`
      insert logs (Description,FkUser_Id) values ('Logged In',${req.session.userId})
    `);
      req.flash('success', 'Login Successfully');
      //Redirect To Home
      return res.redirect("/");
    });
  }

  /**
   * GET Register
   */
  async register(req, res) {

    var validate = joi.object().keys({
      email: joi.string().required(),
      userName: joi.string().required(),
      password: joi.string().required(),
      userType: joi.string().required()
    }).validate(req.body);

    //Check From 
    if (validate.error) {
      console.log('Register Error:', validate.error);
      req.flash('error', 'Please Enter Full Information');
      return res.redirect('/register')
    }

    //Connect To DB
    var connection = await db.getConnection();

    //Check If Email Is Aleady Used
    if ((await connection.execute(`select count(id) from users where email='${validate.value.email}'`)) > 0) {
      req.flash('error', 'Email Is Already Used');
      return res.redirect('/register')
    }

    //Check If User Name Is Aleady Used
    if ((await connection.execute(`select count(id) from users where username='${validate.value.userName}'`)) > 0) {
      req.flash('error', 'User Name Is Already Used');
      return res.redirect('/register')
    }

    //Encrypt Password
    validate.value.password = service.encrypt_password(validate.value.password);

    //Insert User
    var user = await connection.execute(`insert users (email,username,usertype,password) values ('${validate.value.email}','${validate.value.userName}','${validate.value.userType}','${validate.value.password}')`)

    //Login 
    req.session.userId = user.Id;
    return req.session.save(async () => {
      await connection.excute(`
      insert logs (Description,FkUser_Id) values ('Registred',${req.session.userId})
    `);
      req.flash('success', 'Registred Account Successfully');
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
