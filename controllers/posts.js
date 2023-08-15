const Post = require("../models/post")
const Comment = require("../models/comment")

module.exports = {
    index,
    show,
    new: newPost,
    create,
    remove,
    edit,
    update: updatePost,
}

async function index(req, res) {
    try {
        const results = await Post.find({})
        res.render('posts/index', { title: "All Posts", posts: results })
    } catch (err) {
        console.log(err);
    }

}

async function show(req, res, next) {
try {
  const post = await Post.findById(req.params.id)
  const allComments = await Comment.find({parentId: post._id})
  res.render("posts/show", {
    title: "Post Detail",
    post, 
    allComments
  })

} catch (err) {
   console.log(err)
   next(Error(err)) 
}
}

async function remove (req, res) { 
    await Post.deleteOne({_id: req.params.id})
    await Comment.deleteMany({parentId: req.params.id})
    res.redirect('/posts')
}




function newPost(req, res) {
    res.render('posts/new', {title: 'New Post', errorMsg: ""})
}

async function create(req, res) { 
    const postData = {...req.body} 
    postData.isEdited = false;
    postData.user = req.user._id
    postData.userName = req.user.name;
    postData.userAvatar = req.user.avatar;

    try { 
    const createdPost = await Post.create(postData)
    res.redirect("/posts/" + createdPost._id)
    } catch (err) { 
        console.log(err); 
        res.render("posts/new", {errorMsg: err.message})
    }

} 

async function edit(req, res) {
    const post = await Post.findById(req.params.id)

    res.render('posts/edit', {
        title: 'Edit Post', 
        post,
        errorMsg: ""})
}

async function updatePost(req, res){
    try {
        const edittedPost = await Post.findById(req.params.id)
        const postData = {...req.body} 
        postData.isEdited = true
        
        for (key in postData){
            edittedPost[key] = postData[key]
        }

        edittedPost.save()
        res.redirect(`/posts/${edittedPost._id}`);
    } catch (err) {
        console.log(err);
    }
}