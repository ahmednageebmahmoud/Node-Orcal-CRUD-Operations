const joi = require('joi')

class PostModuel {
  /**
   * Get List Of Posts 
   */
  async list(req, res) {
    //Connect To DB
    var connection = await db.getConnection();

    var posts = await connection.excute(`select 
      posts.*,
      users.UserName 
    from posts join users on users.Id = posts.FkUser_Id order by posts.id desc`)

    res.render('posts/list', posts)
  }

  /**
   * Create A New Post
   */
  async create(req, res) {
    var validate = joi.object().keys({
      title: joi.string().required(),
      description: joi.string().required(),
    }).validate(req.body);

    //Check From 
    if (validate.error) {
      req.flash('error', 'Please Enter Full Information');
      return res.render('/post')
    }

    //Connect To DB
    var connection = await db.getConnection();
    await connection.excute(`
      insert posts (title,description) values (N'${validate.value.title}',N'${validate.value.description}')
    `)

    //Add Log
    await connection.excute(`
      insert logs (Description,FkUser_Id) values ('${req.session.user.UserName} Insert New Post With Title ${post.Title}',${req.session.userId})
    `);

    req.flash('success', 'Post Created Successfully');
    res.redirect('/post')
  }

  /**
   * Update Post
   */
  async update(req, res) {
    var validate = joi.object().keys({
      title: joi.string().required(),
      description: joi.string().required(),
    }).validate(req.body);

    //Check From 
    if (validate.error) {
      req.flash('error', 'Please Enter Full Information');
      return res.render('/post')
    }

    //Connect To DB
    var connection = await db.getConnection();
    var post = await connection.excute(`select * from posts where id=${req.params.id}`)

    //Cehck If Not Found
    if (!post) {
      req.flash('error', 'Post Is Not Found');
      return res.render('/post')
    }

    await connection.excute(`
      update posts set title=N'${validate.value.title}', description=N'validate.value.description' where id =${req.params.id}')
    `)

    //Add Log
    await connection.excute(`
      insert logs (Description,FkUser_Id) values ('${req.session.user.UserName} Update Post ${post.Title}',${req.session.userId})
    `);

    req.flash('success', 'Post Updated Successfully');
    res.redirect('/post')
  }

  /**
   * Delete Post
   */
  async delete(req, res) {
    //Connect To DB
    var connection = await db.getConnection();

    var post = await connection.excute(`select * from posts where id=id=${req.params.id}`);
    if (!post) {
      req.flash('error', 'Post Is Not Found');
      return res.render('/post')
    }

    await connection.excute(`delete posts where id=${req.params.id}`);

    //Add Log
    await connection.excute(`
      insert logs (Description,FkUser_Id) values ('${req.session.user.UserName} Deleted ${post.Title}',${req.session.userId})
    `);

    req.flash("success", "Post Created Successfully");
    //Back To Posts Page
    res.render('posts/deleted-confirm')
  }
}

//Export New Post Module Inctance
module.exports = new PostModuel();
