// Importação de módulos
const axios = require('axios');
require('dotenv').config();
const authMarketingCloudService = require('./authMarketingCloudService');
const erroHandle = require('./erroHandle');
const { MARKETING_CLOUD_REST_URL } = process.env;

/**
 * Obtém dados de uma extensão de dados na Marketing Cloud.
 * @param {string} dataExtensionKey - Chave da extensão de dados.
 * @param {string} filter - Filtro opcional para a consulta.
 * @returns {Promise<Object>} Objeto contendo os dados da extensão.
 */
const getDataFromExtensions = async (dataExtensionKey, filter) => {
    const accessToken = await authMarketingCloudService.refreshToken();
    const baseUrl = MARKETING_CLOUD_REST_URL;
    let endpoint = `/data/v1/customobjectdata/key/${dataExtensionKey}/rowset`;
    let dataExtension = [];
    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };

    if (filter) {
        endpoint += filter;
    }
    try {
        const response = await axios.get(`${baseUrl}${endpoint}`, { headers });
        dataExtension = response;
    } catch (error) {
        erroHandle.handleErro('Service MarketingCloud: Retrive DataExtension data Error', error.response.status, error.response.data.message);
    }

    return dataExtension;
};

/**
 * Atualiza uma extensão de dados na Marketing Cloud.
 * @param {string} dataExtensionKey - Chave da extensão de dados.
 * @param {Object} payload - Dados a serem atualizados.
 * @returns {Promise<Object>} Objeto contendo a resposta da operação de atualização.
 */
const updateDataextension = async (dataExtensionKey, payload) => {
    const accessToken = await authMarketingCloudService.refreshToken();
    const baseUrl = MARKETING_CLOUD_REST_URL;
    let endpoint = `/hub/v1/dataevents/key:${dataExtensionKey}/rowset`;

    const headers = {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
    };
    try {
        const response = await axios.post(`${baseUrl}${endpoint}`, payload, { headers });
        return response.data;
    } catch (error) {
        erroHandle.handleErro('Service Marketing Cloud: Update DataExtension Error', error.response.status, error.response.data.message);
    }
};

module.exports = { getDataFromExtensions, updateDataextension };
