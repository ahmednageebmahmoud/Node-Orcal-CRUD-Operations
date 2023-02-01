

module.exports = function () {
    global.mw.checkIfAuth = (userTpeNeed) => {
        return (req, res, next) => {
            if (userTpeNeed && userTpeNeed != res.locals.userType) {
                return res.render('/')
            }
            next();
        }
    };

    global.mw.loadUserInfo = (req, res, next) => {
        req.flash('isLoggedUser', false);
        req.flash('loggedUserType', null);
        try {
            
 
        if (!req.session.userId) {
            next();
            return
        }

        //Connect To DB
        db.getConnection().then(async res => {
            //Insert User
            var user = await connection.execute(`select * from  users where id=${req.session.userId}`)
            if (!user) {
                next();
                return
            }
            req.flash('isLoggedUser', true);
            req.flash('loggedUserType', user.UserType);
            next();
        })
    } catch (error) {
        next();
    }


    }
}