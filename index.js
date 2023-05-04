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

    Article.findAll({order: [['id','DESC']],limit : 4}).then(articles=>{

        Category.findAll().then(categories=>{

            res.render('index',{
                articles:articles,
                categories:categories
             })
        })



    })
})

app.get('/find/:slug',(req,res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug:slug
        } 
        
    }).then(article=>{
        if(article != undefined){
            Category.findAll().then(categories=>{

                res.render('article',{
                    article:article,
                    categories:categories
                 })
            })
        }else{
            res.redirect('/')
        }
    }).catch(err =>{
        res.redirect("/")
    });
  
    })




    app.get('/find/category/:slug',(req,res)=>{
        var slug = req.params.slug;

        Category.findOne({
            where: {
                slug:slug
            },
            include:[{model: Article}]
        }).then(category=>{
            
            if(category != undefined){
            
                Category.findAll().then(categories =>{
                   
                    res.render('category',{
                        articles: category.articles,
                        categories: categories
                    })
                })



            }else{
                res.redirect('/')
            }
          
        })
    })


    //metodo para acessar uma categoria, sem utilidade apenas foi usado para praticar!
  //  app.get('/find/category/:slug',(req,res)=>{
  //      var slug = req.params.slug;
  //    
  //          Category.findOne({
  //              where:{
  //                  slug:slug
  //              }
  //          }).then(category=>{
  //              if(slug != undefined){
  //              Category.findAll().then(categories=>{
  //                  res.render('category',{
  //                      category:category,
  //                      categories: categories
  //              })
  //              })
  //              }else{
  //                  res.redirect('/')
  //              }
  //          }).catch(err=>{
  //              res.redirect('/')
  //          })
  //  
  //    
  //  })



app.listen('8080',()=>{
    console.log('Servidor Iniciado!')
})