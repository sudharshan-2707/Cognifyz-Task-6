const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./db"); // Assuming db.js exports the sequelize instance

const Review = sequelize.define("Review", {
  comment: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5,
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
  authorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Users",
      key: "id",
    },
  },
  listingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Listings",
      key: "id",
    },
  },
});

module.exports = Review;
