// Importação de módulos
const axios = require('axios');
require('dotenv').config();
const authMarketingCloudService = require('./authMarketingCloudService');
const { DE_LOGS, MARKETING_CLOUD_REST_URL } = process.env;

/**
 * Envia dados de erro para a Marketing Cloud.
 * @param {string} Error - Descrição do erro.
 * @param {number} StatusCode - Código de status HTTP relacionado ao erro.
 * @param {string} FullError - Descrição completa do erro.
 * @returns {Promise<void>} Promessa indicando a conclusão do envio.
 */
const handleErro = async (Error, StatusCode, FullError) => {
    const accessToken = await authMarketingCloudService.refreshToken();
    const baseUrl = MARKETING_CLOUD_REST_URL;
    let endpoint = `/data/v1/async/dataextensions/key:${DE_LOGS}/rows`;
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };
    const payload = {
        "items": [{
            "Error": Error,
            "StatusCode": StatusCode,
            "FullError": FullError
        }]
    };
    try {
        resp = await axios.post(`${baseUrl}${endpoint}`, payload, { headers });
    } catch (error) {
        return 'Erro ao enviar dados de erro para a Marketing Cloud';
    }
};

module.exports = { handleErro };
