const oracledb = require("oracledb");
oracledb.autoCommit = true; //Commita queries
const dbConfig = {
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  connectString: process.env.DB_CONNECTIONSTRING,
};

module.exports = {
  getConnection: () => oracledb.getConnection(dbConfig),

  async migrate() {
    
    console.log(`
            ======
                DataBase Migration Is Started
            ====`);
            oracledb.getConnection(dbConfig).then(c=> console.log(c)).catch(err=> console.log(err))

            return
    //Open Connection
    var connection = await oracledb.getConnection(dbConfig);

    //Create Users Table If Not Created
    connection.execute(`IF  NOT EXISTS (SELECT * FROM sys.objects 
    WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
    
    BEGIN
    CREATE TABLE [dbo].[Users](
       Id bigint primary key identity(1,1),
       UserName nvarchar(150) Not NULL,
       Email nvarchar(150) Not NULL,
       Password nvarchar(150) Not NULL,
       UserType nvarchar(150) Not NULL
    ) 
    END
    `);

    //Create Posts Table If Not Created
    connection.execute(`IF  NOT EXISTS (SELECT * FROM sys.objects 
            WHERE object_id = OBJECT_ID(N'[dbo].[Posts]') AND type in (N'U'))
            
            BEGIN
            CREATE TABLE [dbo].[Posts](
               Id bigint primary key identity(1,1),
               Title nvarchar(max) Not NULL,
               Description nvarchar(max) Not NULL,
               FkUser_Id bigint Not NULL,
               FOREIGN KEY (FkUser_Id) REFERENCES Users (Id) Not NULL
            ) 
            END`);

    console.log(`
            ======
                DataBase Migration Is Finshed
            ====`);
  },
};
