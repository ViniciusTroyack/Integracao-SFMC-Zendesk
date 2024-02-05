// Importação de módulos
const axios = require('axios');
require('dotenv').config();
const erroHandle = require('./erroHandle');
const { ZENDESK_URL, ZENDESK_TOKEN } = process.env;

/**
 * Atualiza vários usuários no Zendesk.
 * @param {Object} payload - Dados dos usuários a serem atualizados.
 * @returns {Promise<Object>} Resposta da requisição de atualização.
 */
const updateUsers = async (payload) => {
    const baseUrl = ZENDESK_URL;
    let endpoint = `/update_many.json`;
    const headers = {
        'Authorization': `Basic ${ZENDESK_TOKEN}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.put(`${baseUrl}${endpoint}`, payload, { headers });
        return response;
    } catch (error) {
        erroHandle.handleErro(`Service: Erro na requisição: ${error.response.status} - ${error.response.data.errors}`);
    }
};

/**
 * Realiza uma busca de usuários no Zendesk com base em parâmetros de consulta.
 * @param {string} queryParameter - Parâmetros de consulta para a busca.
 * @returns {Promise<Object>} Resposta da requisição de busca.
 */
const searchUsers = async (queryParameter) => {
    const baseUrl = ZENDESK_URL;
    let endpoint = `/search.json?query=`;
    const headers = {
        'Authorization': `Basic ${ZENDESK_TOKEN}`,
    };
    try {
        const response = await axios.get(`${baseUrl}${endpoint}${queryParameter}`, { headers });
        return response.data;
    } catch (error) {
        console.error(`Service Zendesk: Erro na requisição: ${error.response.status} - ${error.response.data.errors}`);
    }
};

module.exports = { updateUsers, searchUsers };
