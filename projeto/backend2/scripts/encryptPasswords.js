const bcrypt = require('bcryptjs');
const initModels = require('../src/Models/init-models');
const db = require('../src/config/database'); // ajuste conforme seu ficheiro real


const models = initModels(db);
const { utilizadores } = models;

// Função para criptografar senhas
async function criptografarSenhas() {
  try {
    const users = await utilizadores.findAll();

    for (const user of users) {
      if (!user.senha.startsWith('$2b$')) {
        const hash = await bcrypt.hash(user.senha, 10);

        await utilizadores.update(
          { senha: hash },
          { where: { id: user.id } }
        );

        console.log(`Senha de ${user.email} criptografada.`);
      }
    }

    console.log('Criptografia concluída.');
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await db.close(); // se usar db.close()
  }
}

criptografarSenhas();