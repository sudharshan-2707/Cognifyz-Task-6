const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("reviewDb", "root", "123@456", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;
