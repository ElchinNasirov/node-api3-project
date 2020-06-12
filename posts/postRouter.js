const express = require('express');

const postDB = require("./postDb");

const router = express.Router();

router.get('/', (req, res) => {
  // do your magic!
  postDB.get()
    .then(posts => res.status(200).json(posts))
    .catch(err => {
      console.log(err)
      res.status(500).json({ message: "Couldn't retrieve posts" })
    })
});

router.get('/:id', validatePostId, (req, res) => {
  // do your magic!
  res.status(200).json(req.posts)
});

router.delete('/:id', (req, res) => {
  // do your magic!
  const { id } = req.params;
  postDB.remove(id)
    .then(post => {
      console.log(post)
      res.status(200).json({ message: 'The post has been deleted.' });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ error: 'The post could not be recovered.' });
    });
});

router.put('/:id', validatePostId, (req, res) => {
  // do your magic!
  const { id } = req.params;
  const changes = req.body;
  if (!changes.text) {
    res.status(400).json({ message: 'Need to update the posts text.' });
  } else {
    postDB.update(id, changes)
      .then(update => {
        res.status(200).json(update);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({ message: 'Failed to update Post.' });
      });
  }
});

// custom middleware
function validatePostId(req, res, next) {
  // do your magic!
  const { id } = req.params;
  console.log(id);
  postDB.getById(id)
    .then(post => {
      if (post) {
        req.posts = post
        next()
      }
      else {
        res.status(400).json({ message: "Invalid" })
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: 'Server error validating post ID' });
    })

}

module.exports = router;
