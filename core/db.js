const oracledb = require('oracledb');
oracledb.autoCommit = true; //Commita queries
const dbConfig = {
    user          : process.env.DB_USERNAME ,  
    password      : process.env.DB_PASSWORD,  
    connectString : "IP:1521/NOME_DO_SERVICO",
};


module.exports={
    getConnection:()=>oracledb.getConnection(dbConfig),
    
 async   migrate(){
    //Open Connection 
    var connection=this.getConnection();

        //Create Users Table If Not Created
connection.exports()

        //Create Posts Table If Not Created
    }
}