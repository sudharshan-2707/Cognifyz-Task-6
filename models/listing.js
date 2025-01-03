const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("./db"); // Assuming db.js exports the sequelize instance

const Listing = sequelize.define("Listing", {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  image_filename: {
    type: DataTypes.STRING,
    defaultValue: "listingImage",
  },
  image_url: {
    type: DataTypes.STRING,
    defaultValue:
      "https://images.unsplash.com/photo-1700157646951-801cd3df4092?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set(value) {
      return value === "" ? 
        "https://images.unsplash.com/photo-1700157646951-801cd3df4092?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" :
        value;
    },
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lng: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lat: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  hooks: {
    afterDestroy: async (listing, options) => {
      // Delete associated reviews if listing is deleted
      await Review.destroy({
        where: {
          listingId: listing.id
        }
      });
    },
  }
});

module.exports = Listing;
