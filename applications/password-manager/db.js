const { Sequelize, Model, DataTypes } = require('sequelize');

const dbURI = (
    process.env.DATABASE_URL ||
    'postgres://postgres:niranjan@192.168.43.164:5432/heroku_local'
);

const sequelize = new Sequelize(dbURI);

class PasswordManager_Users extends Model {}

PasswordManager_Users.init({
    username : {
        primaryKey : true,
        type: DataTypes.STRING(15),
        validate : {
            is:{
                args : /[a-zA-Z]*/g,
                msg : "Username can contain only alphabets."
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

sequelize.sync({})
.then(() => console.log("PostgreSQL DB authentication success"))
.catch((error) => console.error(error));

module.exports = { sequelize, Users : PasswordManager_Users };