const Sequelize = require('sequelize');

const connection = require('../database/database');
const Category = require('../categories/Category');

const Article = connection.define('articles',{
    title:{
       type : Sequelize.STRING,
       allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});


//um artigo pertence a uma categoria 1-1
Article.belongsTo(Category);

//Uma categoria tem muitos artigos 1-n
Category.hasMany(Article);

//comentado pois ja foi criado, esse comando cria no banco
// Article.sync({force: true});
module.exports = Article;

