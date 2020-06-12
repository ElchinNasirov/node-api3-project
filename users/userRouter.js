const express = require('express');
const userDB = require("./userDb");
const postDB = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  res.status(200).json(req.u)
});

router.post('/:id/posts', validatePost, (req, res) => {
  // do your magic!
  res.status(200).json(req.uPost)
});

router.get('/', (req, res) => {
  // do your magic!
  userDB.get()
    .then(user => res.status(200).json(user))
    .catch(err => res.status(500).json({ message: "Error retrieving the users" }))
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  userDB.getUserPosts(id)
    .then(posts => res.status(200).json(posts))
    .catch(err => res.status(500).json({ message: "Unable to retrieve posts" }))
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  userDB.remove(req.params.id)
    .then(res.status(200).json({ message: "The user has been deleted" }))
    .catch(res.status(500).json({ message: "Could bot be deleted" }))
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  const changes = req.body;

  if (!changes.name) {
    res.status(500).json({ message: "Need to update teh username" })
  }
  else {
    userDB.update(id, changes)
      .then(update => res.status(200).json(update))
      .catch(err => res.status(500).json({ message: "Failed to update username" }))
  }
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  console.log(id);
  userDB.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      }
      else {
        res.status(404).json({ message: "Invalid user ID" })
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "Server error validating user ID" })
    })

}

function validateUser(req, res, next) {
  // do your magic!
  const user = req.body;
  userDB.insert(user)
    .then(u =>
      !u
        ? res.status(400).json({ message: "No user" })
        : !u.name
          ? res.status(400).json({ message: "No user name" })
          : (req.u = u)
          & next()
    )
    .catch(err => {
      res.status(500).json({ message: "Error adding a user" })
    })
}

function validatePost(req, res, next) {
  // do your magic!
  const { id } = req.params;
  const user = { ...req.body, user_id: id };
  postDB.insert(user)
    .then(u =>
      !u & console.log(u)
        ? res.status(400).json({ message: "No user" })
        : !u.text
          ? res.status(400).json({ message: "Missing post data" })
          : (req.uPost = u) & console.log(u, "Test")
          & next()
    )
    .catch(err => res.status(500).json({ message: "Error" }))
}

module.exports = router;
