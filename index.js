const express = require('express')

const app = express();

const connection = require('./database/database')

//import nos controllers
const categoriesController = require('./categories/CategoriesController');
const articlesCOntroller = require('./articles/articlesControler');

//import models
const Article = require('./articles/Article');
const Category = require('./categories/Category');
//View engine
app.set('view engine','ejs');


//formularios
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());

//Statics, carregar css
app.use(express.static('public')); 

//database
connection.authenticate().then(()=>{
    console.log("Conexao realizada com sucesso!");
}).catch((msgErro)=>{
    console.log("Conexao falhou!");
});


//usar rotas do controller de categorias em index
// '/' é um prefixo, como n tem nada n precisa colocar na url mas para chamar as rotas do contoller se tivesse algo teria que por o prefixo antes;
app.use('/',categoriesController);

//usar rotas do controller de articles em index, com prefixo
app.use('/',articlesCOntroller);


app.get('/',(req,res)=>{

    Article.findAll().then(articles=>{
         res.render('index',{
            articles:articles
         })
    })
})

app.get('/:slug',(req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        }

    }).then(article=>{
        if(article != undefined){
            res.render('/',{
                article:article
            })
        }else{
            res.redirect('/')
        }
    }).catch(err =>{
        res.redirect("/")
    });
  
    })











app.listen('8080',()=>{
    console.log('Servidor Iniciado!')
})