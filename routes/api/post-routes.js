const router = require('express').Router();
const { Post, User, Vote } = require('../../models');
const { route } = require('./user-routes');
const sequelize = require('../../config/connection');

// GET /api/posts/  -get all posts
router.get('/', (req, res) => {
    console.log('==========');
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    }).then(dbPostData => res.json(dbPostData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// GET /api/posts/:id - get one post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
      .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/posts/ - create a post
router.post('/', (req, res) => {
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});


// PUT /api/posts/upvote - vote on a post 
// (declare before :id or express will think upvote is a param)
router.put('/upvote', (req, res) => {
    // create the vote
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
    }).then( () => {
        // then find the post we just voted on
        return Post.findOne({
            where: {
                id: req.body.post_id
            },
            attributes: [
                'id',
                'post_url',
                'title',
                'created_at',
                // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
                [
                sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                'vote_count'
                ]
            ]
        })
          .then(dbPostData => res.json(dbPostData))
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
    });
});

// PUT /api/posts/:id - update a post
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
     .then(dbPostData => {
         if (!dbPostData) {
             res.status(404).json({ message: 'No post found with this id'});
             return;
         }
         res.json(dbPostData);
     })
       .catch(err => {
           console.log(err);
           res.status(500).json(err);
    });
});

// DELETE /api/posts/:id - delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
      .then(dbPostData => {
          if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id'});
              return;
          }
          res.json(dbPostData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});



module.exports = router;