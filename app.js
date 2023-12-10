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
app.get('/posts/:postId', async (req, res) => {
  try {
    const requestedPostId = req.params.postId;

    const post = await Post.findOne({ _id: requestedPostId }).exec();

    if (!post) {
      // Handle case where post is not found
      res.status(404).send('Post not found');
      return;
    }

    res.render('post', { post: post });
  } catch (err) {
    console.error(err);
    // Handle other errors as needed
    res.status(500).send('Internal Server Error');
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});