const axios = require('axios');

async function testAPI() {
  try {
    console.log('🔍 Testando API de propostas...');
    
    // Testar endpoint de propostas
    const response = await axios.get('http://localhost:3000/api/propostas');
    console.log('✅ API de propostas funcionando!');
    console.log(`📊 Número de propostas: ${response.data.length}`);
    
    // Mostrar detalhes das propostas
    response.data.forEach((proposta, index) => {
      console.log(`\n📋 Proposta ${index + 1}:`);
      console.log(`   ID: ${proposta.idproposta}`);
      console.log(`   Nome: ${proposta.nome}`);
      console.log(`   Categoria: ${proposta.categoria}`);
    });
    
  } catch (error) {
    console.error('❌ Erro na API:', error.response?.data || error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Headers:', error.response.headers);
    }
  }
}

testAPI();
