// Importação de módulos
const marketingCloudController = require('./marketingCloudController');
const marketingCloudService = require('../services/dataExtensionMarketingCloudService');
const zendekService = require('../services/zendeskService');
const erroHandle = require('../services/erroHandle');
const { DE_USUARIO } = process.env;

/**
 * Divide um conjunto de dados em lotes.
 * @param {Array} data - Conjunto de dados a ser dividido.
 * @param {number} batchSize - Tamanho do lote.
 * @returns {Array<Array>} Lista de lotes.
 */
const batchSplit = (data, batchSize) => {
    const lotes = [];
    for (let i = 0; i < data.length; i += batchSize) {
        lotes.push(data.slice(i, i + batchSize));
    }
    return lotes;
}

/**
 * Processa IDs de usuários na Marketing Cloud e atualiza dados no Zendesk.
 * @returns {Promise<string>} Promessa indicando a conclusão do processamento.
 */
const processIds = async () => {
    try {
        const filter = `?$filter=id eq null`
        const users = await marketingCloudController.getMarketingCloudDataUsers(DE_USUARIO, filter);
        const batchs = batchSplit(users, 100);
        for (const batch of batchs) {
            await processBatch(batch);
        }
        return 'Dados enviados';
    } catch (error) {
        erroHandle.handleErro('Controller Zendesk: Process IDs erro', '500', error.data);
    }
}

/**
 * Processa um lote de dados de usuários e os envia para o Zendesk.
 * @param {Array} batch - Lote de dados de usuários.
 * @returns {Promise<void>} Promessa indicando a conclusão do processamento.
 */
const processBatch = async (batch) => {
    try {
        let urlFilter = '';
        for (const user of batch) {
            urlFilter += `email:${user.keys.emailaddress}||`;
        }
        const zendekUsers = await zendekService.searchUsers(urlFilter);
        const payload = handlePayload(zendekUsers);
        await marketingCloudService.updateDataextension(DE_USUARIO, payload);
    } catch (error) {
        erroHandle.handleErro('Controller Zendesk: Process Batch erro', '500', error.data);
    }
}

/**
 * Manipula os dados do Zendesk para criação do payload.
 * @param {Object} payload - Dados do Zendesk.
 * @returns {Array} Lista de objetos representando o payload.
 */
const handlePayload = (payload) => {
    let result = []
    for (const user of payload.users) {
        result.push({
            keys: {
                EmailAddress: user.email
            },
            values: {
                id: user.id
            }
        })
    }
    console.log(result);
    return result;
}

module.exports = { processIds };
