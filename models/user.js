const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./db"); // Assuming db.js exports the sequelize instance
const passportLocalMongoose = require("passport-local-mongoose");

const User = sequelize.define("User", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

User.plugin(passportLocalMongoose);

module.exports = User;
