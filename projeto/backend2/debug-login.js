const bcrypt = require('bcryptjs');
const sequelize = require('./src/config/database');
const initModels = require('./src/Models/init-models');

async function debugLogin() {
  try {
    console.log('🔍 Debugging Login Issues...\n');
    
    // Test database connection
    console.log('1. Testing database connection...');
    await sequelize.authenticate();
    console.log('✅ Database connection successful\n');
    
    // Initialize models
    const models = initModels(sequelize);
    const { utilizadores, tipoutilizador } = models;
    
    // Check user types
    console.log('2. Checking user types in database...');
    const userTypes = await tipoutilizador.findAll();
    console.log('Available user types:');
    userTypes.forEach(type => {
      console.log(`  - ID: ${type.idtuser}, Name: ${type.nome}`);
    });
    console.log('');
    
    // Check all users
    console.log('3. Checking all users in database...');
    const allUsers = await utilizadores.findAll({
      include: [{ model: tipoutilizador, as: 'idtuser_tipoutilizador' }]
    });
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in database!');
      return;
    }
    
    console.log(`Found ${allUsers.length} users:`);
    allUsers.forEach((user, index) => {
      console.log(`  ${index + 1}. Email: ${user.email || 'No email'}`);
      console.log(`     Name: ${user.nome || 'No name'}`);
      console.log(`     Type: ${user.idtuser_tipoutilizador?.nome || 'Unknown'}`);
      console.log(`     Password: ${user.senha ? 'Present' : 'Missing'}`);
      console.log(`     Password starts with $2b$: ${user.senha?.startsWith('$2b$') || false}`);
      console.log('');
    });
    
    // Test specific admin login
    console.log('4. Testing admin login...');
    const adminUsers = allUsers.filter(user => 
      user.idtuser_tipoutilizador?.nome?.toLowerCase().includes('admin')
    );
    
    if (adminUsers.length === 0) {
      console.log('❌ No admin users found!');
      console.log('Available user types:', userTypes.map(t => t.nome).join(', '));
    } else {
      console.log(`Found ${adminUsers.length} admin user(s):`);
      adminUsers.forEach(admin => {
        console.log(`  - Email: ${admin.email}`);
        console.log(`    Password hash: ${admin.senha ? 'Present' : 'Missing'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error during debug:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await sequelize.close();
  }
}

debugLogin();