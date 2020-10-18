const { Sequelize, Model, DataTypes } = require('sequelize');

const dbURI = (
    process.env.DATABASE_URL ||
    'postgres://postgres:niranjan@kshirsagar/heroku_local'
);

const sequelize = new Sequelize(dbURI);

class PasswordManager_Users extends Model {}
class PasswordManager_Tags extends Model {}
class PasswordManager_Passwords extends Model {}

PasswordManager_Users.init({
    username : {
        unique : true,
        type: DataTypes.STRING(15),
        validate : {
            is:{
                args : /^[a-z]*$/g,
                msg : "Username can contain only lowercase alphabets."
            },
            isMinLength(value) {
                if(value.length < 8)
                {
                    throw "Username must be minimum of 8 characters";
                }
            }
        }
    },
    hash : {
        type : DataTypes.STRING(64),
        allowNull : false 
    }
},{sequelize});

PasswordManager_Tags.init({
    tag : {
        unique : true,
        type: DataTypes.STRING(15),
        allowNull:false,
        validate : {
            is:{
                args : /^[a-z]*$/g,
                msg : "Tags can contain only lowercase alphabets."
            }
        }
    }
},{sequelize});

PasswordManager_Passwords.init({
    user : {
        type : DataTypes.INTEGER,
        references : {
            model : PasswordManager_Users,
            key : 'id'
        },
        allowNull : false
    },
    password:{
        type : DataTypes.ARRAY(DataTypes.STRING)
    },
    tags : {
        type : DataTypes.ARRAY(DataTypes.INTEGER)
    }
},{ sequelize });

sequelize.sync({})
.then(() => console.log("PostgreSQL DB authentication success"))
.catch((error) => console.error(error));

module.exports = { 
    sequelize, 
    Users : PasswordManager_Users,
    Tags:PasswordManager_Tags,
    Passwords:PasswordManager_Passwords 
};