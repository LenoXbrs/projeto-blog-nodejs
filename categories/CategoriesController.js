const { render } = require('ejs');
const express = require('express');
const router = express.Router();
const Category = require('./Category')
const slugify = require('slugify');
const { where } = require('sequelize');


// tela de teste
router.get('/categories',(req,res)=>{
    res.send('Rota de categorias');
});


    //tela de criação de categoria
router.get('/admin/categories/new',(req,res)=>{
    res.render('admin/categories/new')
});


    // metodo de criação
router.post('/categories/save',(req,res)=>{

    var title = req.body.title;
    // var slug = title.replace(/\s+/g, '-').toLowerCase() meu jeito antigo

    if(title != undefined ){
        Category.create({
            title: title,
            slug: slugify(title),
        }).then(()=>{
            console.log('Categoria ' + title +' criada com sucesso!')
            res.redirect('/admin/categories');
        });
    } else {
        res.redirect('admin/categories/new')
    }
})

    // lista de categorias / tela princial
    router.get('/admin/categories',(req,res)=>{
    Category.findAll({raw: true,order:[['id','ASC']]}).then(categorie => {
        console.log(categorie)
        res.render('admin/categories/index',{
            categories: categorie
        });
    })
})


    // delete de categoria
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
            res.redirect('/admin/categories');
        }
    }else {
        res.redirect('/admin/categories');
    }
})

    // selecionar categoria e envia para formulario de edicao 
router.get('/categories/select/:id',(req,res)=>{
    var id = req.params.id;
    Category.findByPk(id).then(category =>{

        if(isNaN(id)){
            res.redirect('/admin/categories');
        }
        if(category != undefined){
            res.render('admin/categories/edit',{
                category:category
            })
        }else{
            res.redirect('/admin/categories');
        }
    }).catch(erro =>{
        res.redirect('/admin/categories');
    })
})
      // edicao de categoria
router.post('/categories/update',(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
   

    Category.update({title:title,slug:slugify(title)},{
        where: {
            id: id
        }
    }).then(()=>{
        res.redirect('/admin/categories');
    })
})

module.exports = router;