const Sequelize = require('sequelize');
//informacoes para conexao com banco
const connection = new Sequelize('projeto-blog','root','123456',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});


module.exports = connection;