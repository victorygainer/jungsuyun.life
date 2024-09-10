module.exports = (sequelize, DataTypes) => {
    const Profile = sequelize.define('Profile', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      language: {
        type: DataTypes.ENUM('Korean', 'English'),
        allowNull: false
      },
      category: {
        type: DataTypes.ENUM('biography', 'solo_exhibition', 'group_exhibition', 'award', 'public_collection'),
        allowNull: false
      }
    }, {
      timestamps: false
    });
  
    return Profile;
  };
  

  // INSERT INTO Profiles (id, title, year, language, category) VALUES (1, 'test', '2023', 'Korean', 'biography');