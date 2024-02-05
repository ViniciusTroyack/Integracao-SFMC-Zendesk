// Importação de módulos
const marketingCloudService = require('../services/dataExtensionMarketingCloudService');
const zendekService = require('../services/zendeskService');
const erroHandle = require('../services/erroHandle');
const { DE_USUARIOS_PARA_ATUALIZAR, DE_EMAILS, DE_CLICKS, DE_SMS } = process.env;

/**
 * Obtém dados de usuários na Marketing Cloud.
 * @param {string} usersDE - Chave da extensão de dados dos usuários.
 * @returns {Promise<Array>} Lista de usuários da Marketing Cloud.
 */
const getMarketingCloudDataUsers = async (usersDE) => {
    let users = [];
    let nextPage = null;

    try {
        do {
            const dataFromExtension = await marketingCloudService.getDataFromExtensions(usersDE, nextPage);

            users.push(...dataFromExtension.data.items);

            nextPage = getNextPage(dataFromExtension.data.links.next);

        } while (nextPage)

        return users;
    } catch (error) {
        erroHandle.handleErro('Controller Marketing Cloud: Retrive Marketing Cloud users erro', '500', error.data);
    }
};

/**
 * Obtém a próxima página de dados.
 * @param {string} queryString - String de consulta contendo informações sobre a próxima página.
 * @returns {string|null} String com informações sobre a próxima página ou null se não houver próxima página.
 */
const getNextPage = (queryString) => {
    if (queryString) {
        const index = queryString.indexOf('?$page=');
        const pageQueryString = queryString.slice(index);
        return pageQueryString;
    }
    return null;
}

/**
 * Obtém dados de engajamento de um usuário na Marketing Cloud.
 * @param {Object} user - Informações do usuário.
 * @returns {Promise<Object>} Objeto contendo dados de engajamento (emails, clicks, sms).
 */
const getEngagement = async (user) => {
    const filter = `?$filter=emailaddress eq '${user.keys.emailaddress}'`;
    let engagement = { email: [], click: [], sms: [] };

    try {
        const emailEngagement = await marketingCloudService.getDataFromExtensions(DE_EMAILS, filter);
        const clickEngagement = await marketingCloudService.getDataFromExtensions(DE_CLICKS, filter);
        const smsEngagement = await marketingCloudService.getDataFromExtensions(DE_SMS, filter);

        engagement.email.push(...emailEngagement.data.items || []);
        engagement.click.push(...clickEngagement.data.items || []);
        engagement.sms.push(...smsEngagement.data.items || []);

    } catch (error) {
        erroHandle.handleErro('Controller Marketing Cloud: Retrive Marketing Cloud Engagement erro', '500', error.data);
    }
    return engagement;
}

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
 * Processa dados de usuários em lotes e os envia para o Zendesk.
 * @returns {Promise<void>} Promessa indicando a conclusão do processamento.
 */
const processUser = async () => {
    const users = await getMarketingCloudDataUsers(DE_USUARIOS_PARA_ATUALIZAR);
    const batchs = batchSplit(users, 100);
    for (const batch of batchs) {
        await processBatch(batch);
    }
}

/**
 * Processa um lote de dados de usuários e os envia para o Zendesk.
 * @param {Array} batch - Lote de dados de usuários.
 * @returns {Promise<void>} Promessa indicando a conclusão do processamento.
 */
const processBatch = async (batch) => {
    let batchPayload = {
        users: []
    }
    try {
        for (const user of batch) {
            const engagement = await getEngagement(user);
            const engagementPayload = handleEngagementPayload(engagement)
            const userInfos = {
                id: user.values.id,
                user_fields: {
                    engajmento_marketing_cloud: engagementPayload,
                    status_optin_marketing_cloud: user.values.statusoptin
                }
            }
            batchPayload.users.push(userInfos);
        }
        await zendekService.updateUsers(batchPayload);
    } catch (error) {
        erroHandle.handleErro('Controller Marketing Cloud: Process Batch erro', '500', error.data);
    }
}

/**
 * Gera uma string formatada para os dados de engajamento.
 * @param {Object} engagement - Dados de engajamento.
 * @returns {string} String formatada.
 */
function handleEngagementPayload(engagement) {
    function generateObjectString(object, title) {
        let result = title + '\n';

        object.forEach(item => {
            const formattedValues = Object.entries(item.values)
                .filter(([key]) => key !== 'emailaddress')
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');

            result += ` -- ${formattedValues}`;
        });
        return result;
    }

    let result = '';
    result += generateObjectString(engagement.email, 'Emails Recebidos: ');
    result += generateObjectString(engagement.click, 'Clicks Feitos: ');
    result += generateObjectString(engagement.sms, 'SMS Recebidos: ');

    return result;
}

module.exports = { getMarketingCloudDataUsers, processUser };
