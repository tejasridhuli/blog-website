const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/blog-website', { useNewUrlParser: true, useUnifiedTopology: true });

// Define Post Schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model('Post', postSchema);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Home Route
app.get('/', (req, res) => {
  Post.find({})
    .then(posts => {
      res.render('home', { posts: posts });
    })
    .catch(err => {
      console.error(err);
    });
});

// New Post Route
app.get('/compose', (req, res) => {
  res.render('compose');
});

app.post('/compose', async (req, res) => {
  try {
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
    });

    await post.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
  }
});

// Post Route
app.get('/posts/:postId', (req, res) => {
  const requestedPostId = req.params.postId;

  Post.findOne({ _id: requestedPostId }, (err, post) => {
    if (err) {
      console.error(err);
    } else {
      res.render('post', { post: post });
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
