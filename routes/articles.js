const express= require('express')
const router = express.Router()
const Article =require('../models/article')

router.get('/add', (req, res)=>{
    res.render('add_article')
})

router.post('/add', (req, res)=>{
    req.checkBody('title','Title is required').notEmpty();
    req.checkBody('author','Author is required').notEmpty();
    req.checkBody('body','Body is required').notEmpty();
    let errors = req.validationErrors()
    if(errors) res.render('add_article',{

        errors: errors
    })
    let article = new Article()
    article.title = req.body.title
    article.author = req.body.author
    article.body = req.body.body
    //---------
    article.save((err)=>{
        if(err) res.status(500).send(err)
        req.flash('success', 'a new article has been created');
        res.redirect('/')
    })
})
router.get('/:id', (req, res)=>{
    Article.findById(req.params.id, (err, article)=>{
        if(err) res.status(500).send(err)
        res.render('article', {
            title:'Edit article',
            article: article
        })
    })
})

router.get('/edit/:id', (req, res)=>{
    Article.findById(req.params.id, (err, article)=>{
        if(err) res.status(500).send(err)
        res.render('edit_article', {
            article: article
        })
    })
})

router.post('/edit/:id', (req, res)=>{


    let article = {}
    article.title = req.body.title;
    article.author= req.body.author;
    article.body = req.body.body;

    let query = {_id:req.params.id}
    Article.update(query, article, (err,article)=>{
        if (err) res.status(404).send(err)
        res.redirect('/')
    })
})
router.delete('/:id', (req, res)=>{
    let query= {_id: req.params.id}
    Article.remove(query, (err)=>{
        if(err) console.log(err)
        res.send('Done')
    })
})
module.exports = router;