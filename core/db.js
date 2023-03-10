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
    
     //Open Connection
    var connection = await this.getConnection();

    //Create Users Table If Not Created
    connection.execute(`IF  NOT EXISTS (SELECT * FROM sys.objects 
    WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
    
    BEGIN
    CREATE TABLE [dbo].[Users](
       Id bigint primary key identity(1,1),
       UserName nvarchar(150) Not NULL,
       Email nvarchar(150) Not NULL,
       Password nvarchar(150) Not NULL,
       UserType nvarchar(150) Not NULL,
       RegisterDateTime datetime Not NULL DEFAULT GETDATE(),
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
               PostDateTime datetime Not NULL DEFAULT GETDATE(),
               FOREIGN KEY (FkUser_Id) REFERENCES Users (Id) Not NULL
            ) 
            END`);

   //Create Logs Table If Not Created
    connection.execute(`IF  NOT EXISTS (SELECT * FROM sys.objects 
      WHERE object_id = OBJECT_ID(N'[dbo].[Logs]') AND type in (N'U'))
      
      BEGIN
      CREATE TABLE [dbo].[Logs](
         Id bigint primary key identity(1,1),
         Description nvarchar(max) Not NULL,
         FkUser_Id bigint Not NULL,
         LogDateTime datetime Not NULL DEFAULT GETDATE(),
         FOREIGN KEY (FkUser_Id) REFERENCES Users (Id) Not NULL
      ) 
      END`);

    console.log(`
            ======
                DataBase Migration Is Finshed
            ====`);
  },
  
};
