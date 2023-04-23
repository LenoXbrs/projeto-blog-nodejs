const Sequelize = require('sequelize');

const connection = require('../database/database');


const Category = connection.define('categories',{
    title:{
       type : Sequelize.STRING,
       allowNull: false
    },
    slug:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

//comentado pois ja foi criado, esse comando cria no banco
// Category.sync({force: true});

module.exports = Category;

