// PACOTES UTILIZADOS 
const compression = require ("compression");
const express = require ("express");
const ejs = require ("ejs");
const bodyParser = require ("body-parser");
const mongoose = require ("mongoose");
const morgan = require ("morgan");
const cors = require ("cors");

// START DO SERVIDOR
const app = express();

// AMBIENTE - SERVIDOR DE PRODUÇÃO OU HOMOLOGAÇÃO
const isProduction = process.env.NODE_ENV === "production";
const PORT = process.env.PORT || 3000;

// SETUP DOS ARQUIVOS ESTATICOS DENTRO DE PUBLIC
app.use("/public", express.static(__dirname + "/public"));
app.use("/public/images", express.static(__dirname + "/public/images"));

// SETUP DO MONGODB
const dbs = require("./config/database");
const dbURI = isProduction ? dbs.dbProduction : dbs.dbTest;
mongoose.connect(dbURI, { useNewUrlParser: true });

// SETUP DOS ARQUIVOS DE VISUALIZAÇÃO EJS
app.set("view engine", "ejs");

// CONFIGURAÇÕS DE AJUDA NO SISTEMA 
if(!isProduction) app.use(morgan("dev"));
app.use(cors());
app.disable('x-powered-by'); // DEIXANDO MAIS SEGURO O SISTEMA USUARIO NÃO VAI SABER QUE ESTAMOS USANDO EXPRESS
app.use(compression()); // DEIXAR MAIS LEVE AS REQUICIÇÕES 

// SETUP DO BODY PARSER
app.use(bodyParser.urlencoded({extended: false, limit: 1.5*1024*1024}));
app.use(bodyParser.json({limit: 1.5*1024*1024}));

// CHAMANDO OS MODELS QUE IRÁ EXECUTAR ELES
require("./models");

// CHAMANDO AS ROTAS
app.use("/", require("./routes"));

// SE NÃO ACHAR NENHUMA ROTA CAIR NO 404
app.use((req, res, next) => {
   const err = new Error("Not Found");
   err.status = 404;
   next(err);
});

// ROTA QUE VAI TRABALHAR COM VARIOS TIPOS DE ERRO
app.use((err, req, res, next) => {
   res.status(err.status || 500);
    if(err.status !== 404) console.warn("Error: ", err.message, new Date());
    res.json({errors: {message: err.message, status: err.status }});
})

// INICIAR O SERVIDOR
app.listen(PORT, (err) => {
    if(err) throw err;
    console.log(`Servidor Rodando em //localhost:${PORT}`);
});
