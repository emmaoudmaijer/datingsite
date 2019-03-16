var camelcase = require('camelcase');

var multer = require('multer');
var upload = multer({dest: 'static/upload/'});

var slug = require('slug');
var bodyParser = require('body-parser');


//--------------- express

var express = require('express');

var app = express();

var port = 8000;

var data = [
     {
        id: 1,
        name: 'Emma Oudmaijer',
        email: 'Emmaoudmaijer@hva.nl'
     },
     {
        id: 2,
        name: 'Youp Schaefers',
        email: 'youpschaefers@gmail.com'
     }
]
app.post('/', upload.single('cover'), add)
app.use(bodyParser.urlencoded({extended: true}))
app.post('/', add)

app.post ('/account', form)
function form(req, res) {
        res.render('account.pug',{data:data})
}

app.delete('id = req.params.id')




function add(req, res){
        var id = slug(req.body.title).toLowerCase()
        data.push({
                id: id,
                name: name,
                email: req.body.email,
                cover: req.file ? req.filename : null,
        })
       res.redirect('/' + id)
}


function remove(req, res) {
        var id = req.params.id

        data = data.filter(function (value){
                return value.id !== id
        })
        res.json({status: 'ok'})
}

app.set('view engine', 'pug');
app.use(express.static('/static'));

//-------------------- Route naar homepage -------------------------

app.get('/', homepage)
function homepage(req, res) {
        res.render('index.pug');
}

app.get('/aanmelden', aanmelden)
function aanmelden(req, res) {
        res.render('aanmelden.pug');
}

app.get('/account', account)
function account(req, res) {
        res.render('account.pug', {data:data});
}

//-------------------- Route naar aboutme -------------------------
app.get('/aboutme', aboutpage)
function aboutpage(req, res) {
        res.render('about.pug');
}

//---------------------- route naar login --------------------------
app.get('/login', login)
function login(req, res) {
        res.render('login.pug');
}

//----------------------------- error ------------------------------
app.use(function(req, res, next){
  res.status(404);
// default to plain-text. send()
  res.type('txt').send('404 NOT FOUND...');
});

app.listen(port);

