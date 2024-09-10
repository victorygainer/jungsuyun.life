
module.exports = (sequelize, DataTypes) => {
    const Work = sequelize.define('Work', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      medium: {
        type: DataTypes.STRING,
        allowNull: false
      },
      dimensions: {
        type: DataTypes.STRING,
        allowNull: false
      },
      pieces: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      imagePath: {
        type: DataTypes.STRING,
        allowNull: false
      },
      thumbnailPath: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
        timestamps: false,
    });
  
    return Work;
  }