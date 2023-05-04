const express = require('express');
const router = express.Router();
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify');
const { route } = require('./articlesControler');






router.get('/admin/articles/new',(req,res)=>{
    Category.findAll().then(categories=>{
        res.render('admin/articles/new',{
            categories: categories,
           })
    })
  
});

router.post('/articles/save',(req,res)=>{
    
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;


    Article.create({
        title: title,
        slug:slugify(title),
        body: body,
        categoryId: category
    }).then(()=>{
        res.redirect('/admin/articles')
    })
  
});

//lista de artigos
router.get('/admin/articles',(req,res)=>{
    //fazendo join com category 
    Article.findAll({
        include: [{model: Category}]
    }).then(articles=>{
        res.render('admin/articles/index',{
        
            articles:articles
        })
    })
})



    //delete
    router.post('/admin/article/delete',(req,res)=>{
        var articleId = req.body.articleId;
        if(articleId != undefined){
            if(!isNaN(articleId)){
                Article.destroy({
                    where:{ id: articleId}
                }).then(()=>{
                    res.redirect('/admin/articles')
                })
            }else{
                res.redirect('/admin/articles')
            }
           
        }else{
            res.redirect('/admin/articles')
        }
       



    })

    //select no artigo para update
    router.get('/article/select/:id',(req,res)=>{
        var id = req.params.id;

        Article.findOne({
            where: {
                id:id
            },
            include: [{model: Category}]
        }).then(article=>{

            if(isNaN(id)){
                res.redirect('/admin/articles')
            }

            Category.findAll().then(categories=>{
                if(article != undefined){
                    res.render('admin/articles/edit',{
                            article: article,
                            categories: categories
                            
                        })
                    }else{
                        res.redirect('/admin/articles')
                    }
                    
                  
            })
            
        })
        
    })


    router.post('/articles/update',(req,res)=>{
        var title = req.body.title;
        var id    = req.body.id;
        var body  = req.body.body;
        var categoryId = req.body.categoryId;

        Article.update({
            title:title,
            slug: slugify(title),
            body: body,
            categoryId: categoryId
        },{
            where: {
                id:id
            }
        }).then(
            res.redirect('/admin/articles')
            )
        
    })
       
    //paginação
    router.get('/articles/page/:num',(req,res)=>{
        var page = req.params.num;

        var offset = 0;

        if(isNaN(page) ||page ==1){
            offset = 0
        }else{
         
            offset = (parseInt(page)-1) * 4 // 4 pq quero exibir apenas 4 offset diz a onde começa e o limit diz quantos
            // se eu tiver 10 obj, e dizer offset 4 limit 3, vou começar no 4 e terminar no 7
        }
      
        Article.findAndCountAll({
            limit: 4,
            offset: offset,
            order: [['id','DESC']]
        }).then(articles=>{

            var next;
            if(offset + 4 >= articles.count){
                next = false;
            } else {
                next = true;
            }
            var result =  {
                next : next,
                articles : articles
            }

            Category.findAll().then(categories=>{
                res.render('admin/articles/page',{
                    result : result,
                    categories : categories
                })
           //      res.json(result)
            })
           
        })
    })

module.exports = router;