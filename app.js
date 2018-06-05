const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const PORT = 3003;
const passport = require('passport')
const config = require('./config/database')
let Article = require('./models/article')
//-----------Middlewares------------------//

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname,'public')))
app.use(session({
    secret: 'secString',
    resave: true,
    saveUninitialized: true
    //cookie: { secure: true }
}))
app.use(require('connect-flash')());
app.use((req, res, next)=>{
    res.locals.message = require('express-messages')(req, res);
    next();
})
app.use(expressValidator({
    errorFormatter: function(param, msg, value){
        let namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;
        while(namespace.length){
            formParam += '[' + namespace.shift() +']'
        }
        return {
            param: formParam,
            msg : msg,
            value : value
        }
    }
}))

//------------------------------------
mongoose.connect(config.database)
const db = mongoose.connection;
db.once('open', ()=>{
    console.log('Connected to database 0_0')
})
db.on('error', (err)=>{
    console.log(err)
})

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

//-----------Passport Config
require('./config/passport')(passport)
app.use(passport.initialize())
app.use(passport.session())


app.get('/', (req, res)=>{
    Article.find((err, articles)=>{
        if(err) res.status(500).send(err)
        res.render('index.pug', {
            title: 'Welcome to ArtKlz',
            articles: articles
        })
    })
    
})
//-------Router-----
let articles = require('./routes/articles')
let users = require('./routes/users')
app.use('/articles', articles)
app.use('/users', users)

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}...`)
})


