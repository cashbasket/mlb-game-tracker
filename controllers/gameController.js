const db = require('../models');

// Defining methods for the teamController
module.exports = {
  // Return data for single team
  game: function(req, res) {
    const userId = req.user ? req.user.id: null;
    db.game.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: db.team,
        as: 'Home',
        required: true
      },
      {
        model: db.team,
        as: 'Away',
        required: true
      },
      {
        model: db.venue,
        required: true
      },
      {
        model: db.attendance,
        required: false,
        where: { userId: userId }
      }]
    })
      .then(dbGame => res.json({
        game: dbGame
      }))
      .catch(err => res.status(400).json(err));
  },

  //gets all attendance records for game
  attendees: function(req, res) {
    db.attendance
      .findAll({
        where: {
          gameId: req.params.id
        }
      })
      .then(dbAttendees => res.json({
        attendees: dbAttendees
      }))
      .catch (err => res.status(400).json(err));
  },

  // create an attendance record
  createAtt: function(req, res) {
    db.attendance
      .create(req.body)
      .then(dbAttendance => res.json(dbAttendance))
      .catch(err => res.status(400).json(err));
  },

  // delete route for deleting attendance records
  deleteAtt: function(req, res) {
    db.attendance.destroy({
      where: {
        userId: req.user.id,
        gameId: req.params.id
      }
    })
      .then(dbAttendance => res.json(dbAttendance))
      .catch(err => res.status(400).json(err));
  },

  posts: function(req, res) {
    db.post.findAll({
      include: [{
        model: db.user,
        required: true,
        attributes: { exclude: ['email', 'password', 'token', 'tokenExpires']},
        include: [{
          model: db.attendance,
          required: false,
          where: {
            gameId: req.params.id
          }
        }] 
      }],
      where: { gameId: req.params.id },
      order: [
        ['postDate', 'DESC']
      ]
    })
      .then(dbPost => res.json({
        posts: dbPost
      }))
      .catch(err => res.status(400).json(err));
  },

  // create a post record
  createPost: function(req, res) {
    db.post
      .create(req.body)
      .then(dbPost => res.json(dbPost))
      .catch(err => res.status(400).json(err));
  },

  // updates a post
  updatePost: function(req, res) {
    db.post.update({
      postText: req.body.postText
    },{
      where: {
        id: req.params.id
      }
    }).then(dbPost => res.json(dbPost))
      .catch(err => res.status(400).json(err));
  },

  // delete route for deleting posts
  deletePost: function(req, res) {
    db.post.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    })
      .then(dbPost => res.json(dbPost))
      .catch(err => res.status(400).json(err));
  },

  // gets all comments for a post
  comments: function(req, res) {
    db.comment.findAll({
      include: [{
        model: db.user,
        required: true,
        attributes: { exclude: ['email', 'password', 'token', 'tokenExpires']},
      }],
      where: { postId: req.params.id },
      order: [
        ['commentDate', 'DESC']
      ]
    })
      .then(dbComment => res.json({
        comments: dbComment
      }))
      .catch(err => res.status(400).json(err));
  },

  // create a comment record
  createComment: function(req, res) {
    db.comment
      .create(req.body)
      .then(dbComment => res.json(dbComment))
      .catch(err => res.status(400).json(err));
  },

  updateComment: function(req, res) {
    db.comment.update({
      commentText: req.body.commentText
    },{
      where: {
        id: req.params.id
      }
    }).then(dbComment => res.json(dbComment))
      .catch(err => res.status(400).json(err));
  },

  // delete route for deleting comments
  deleteComment: function(req, res) {
    db.comment.destroy({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    })
      .then(dbComment => res.json(dbComment))
      .catch(err => res.status(400).json(err));
  }
};
