const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

// create associations
User.hasMany(Post, {
    foreignKey: 'user_id' // points to user_id in the Post model
});

Post.belongsTo(User, {
    foreignKey: 'user_id' // points to user_id in itself
});

// allow both the User and Post models to query each other's information in the context of a vote.
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// directly connect/associate Vote model to User and Post
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports ={ User, Post, Vote };