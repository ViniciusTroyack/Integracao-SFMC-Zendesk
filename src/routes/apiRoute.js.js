// Importação de módulos
const express = require('express');
const marketingCloudController = require('../controllers/marketingCloudController');
const userZendeskController = require('../controllers/zendeskContoller');
const router = express.Router();

/**
 * Rota para iniciar o processamento de dados na Marketing Cloud.
 * Retorna uma resposta imediata e inicia o processamento em segundo plano.
 */
router.post('/process-users', async (req, res) => {
  try {
    res.status(200).send('Processing started. Check logs for progress.');

    // Inicia o processamento em segundo plano
    setTimeout(async () => {
      await marketingCloudController.processUser();
      console.log('Processamento concluído!');
    }, 0);
  } catch (error) {
    console.error('Erro durante o processamento:', error);
  }
});

/**
 * Rota para iniciar a busca de usuários no Zendesk.
 * Retorna uma resposta imediata e inicia a busca em segundo plano.
 */
router.post('/search-users', async (req, res) => {
  try {
    res.status(200).send('Processing started. Check logs for progress.');

    // Inicia a busca em segundo plano
    setTimeout(async () => {
      await userZendeskController.processIds();
      console.log('Processamento concluído!');
    }, 0);
  } catch (error) {
    console.error('Erro durante o processamento:', error);
  }
});

module.exports = router;
