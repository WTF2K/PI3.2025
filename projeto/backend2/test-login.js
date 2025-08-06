const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');
const initModels = require('./src/Models/init-models');

async function testLogin() {
  try {
    console.log('Testing database connection...');

    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection successful');

    // Initialize models
    const models = initModels(sequelize);
    const { utilizadores, tipoutilizador } = models;

    console.log('\nTesting user lookup...');

    // Test finding a user (replace with actual admin email from your database)
    const testEmail = 'admin@example.com'; // Replace with actual admin email

    const user = await utilizadores.findOne({
      where: { email: testEmail },
      include: [{ model: tipoutilizador, as: 'idtuser_tipoutilizador' }]
    });

    if (!user) {
      console.log(`❌ No user found with email: ${testEmail}`);
      console.log('\nAvailable users in database:');
      const allUsers = await utilizadores.findAll({
        include: [{ model: tipoutilizador, as: 'idtuser_tipoutilizador' }]
      });

      allUsers.forEach(u => {
        console.log(`- Email: ${u.email}, Type: ${u.idtuser_tipoutilizador?.nome || 'Unknown'}`);
      });
    } else {
      console.log(`✅ User found: ${user.email}`);
      console.log(`User type: ${user.idtuser_tipoutilizador?.nome || 'Unknown'}`);
      console.log(`Password hash: ${user.senha ? 'Present' : 'Missing'} `);

      // Test password verification
      const testPassword = 'admin123'; // Replace with actual admin password
      const senhaValida = await bcrypt.compare(testPassword, user.senha);
      console.log(`Password verification: ${senhaValida ? '✅ Valid' : '❌ Invalid'}`);
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

testLogin();