

module.exports = function () {
    global.mw.checkIfAuth = (userTpeNeed) => {
        return (req, res, next) => {
            if (userTpeNeed && userTpeNeed != res.locals.userType) {
                return res.render('/')
            }
            next();
        }
    };

    global.mw.loadUserInfo = async (req, res, next) => {
        req.flash('isLoggedUser', false);
        req.flash('loggedUserType', null);
        if (req.session.userId) {
            //Connect To DB
            var res = await db.getConnection();
            //Insert User
            var user = await connection.execute(`select * from  users where id=${req.session.userId}`)
            if (!user) {
                next();
                return
            }
            req.flash('isLoggedUser', true);
            req.flash('loggedUserType', user.UserType);
        }

        let data = req.flash();
        console.log('Flash', data);
        res.locals.error = data.error?.[0];
        res.locals.success = data?.success?.[0];
        res.locals.loggedUserType = data?.loggedUserType?.[0];
        res.locals.isLoggedUser = data?.isLoggedUser?.[0];
    }
}