const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const Category = require('./Category')
const slugify = require('slugify');
const { where } = require('sequelize');


router.get('/categories',(req,res)=>{
    res.send('Rota de categorias');
});


router.get('/admin/categories/new',(req,res)=>{



    res.render('admin/categories/new')
});



router.post('/categories/save',(req,res)=>{

    var title = req.body.title;
    // var slug = title.replace(/\s+/g, '-').toLowerCase() meu jeito antigo

    if(title != undefined ){
        Category.create({
            title: title,
            slug: slugify(title),
        }).then(()=>{
            console.log('Categoria ' + title +' criada com sucesso!')
            res.redirect('/admin/categories/new');
        });
    } else {
        res.redirect('admin/categories/new')
    }
})

    router.get('/admin/categories',(req,res)=>{
        
    

    Category.findAll({raw: true,order:[['id','ASC']]}).then(categorie => {
        console.log(categorie)
        res.render('admin/categories/index',{
            categories: categorie
        });
    })
  

})


router.post('/categories/delete',(req,res)=>{

    var id = req.body.id;

    if(id != undefined){

        if(!isNaN(id)){ //for um numero
            Category.destroy({where:{
                id:id
            }}).then( 
                res.redirect('/admin/categories'),
                res.redirect('/admin/categories')
            )
        }else{
            res.redirect('/admin/categories')
        }
    }else {
        res.redirect('/admin/categories')
    }

    
   
})

module.exports = router;