const User = require('./User');
const Post = require('./Post');

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id' // points to user_id in the Post model
});

Post.belongsTo(User, {
    foreignKey: 'user_id' // points to user_id in itself
})

module.exports ={ User, Post };