const express = require('express')

const app = express();

const connection = require('./database/database')
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

app.get('/',(req,res)=>{
    res.render('index')

})











app.listen('8080',()=>{
    console.log('Servidor Iniciado!')
})