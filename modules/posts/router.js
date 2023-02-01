/**
 * 
 * @param {Express} app 
 */
var postModuel = require('./module')
module.exports = app => {
    /** Get Posts  */
    app.get('/post', postModuel.list)

    /** Create Post */
    app.post('/post', postModuel.create)

    /** Edit Posts Page  */
    app.get('/post/update/:id', postModuel.list)

    /** Edit Post */
    app.put('/post', postModuel.update)

    /** Delete Post */
    app.get('/post/delete/:id', postModuel.delete)
};