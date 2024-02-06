/**
 * Verifica se o corpo da autenticação recebida corresponde às credenciais da API.
 * @param {Object} authBody - O corpo da autenticação recebida.
 * @returns {boolean} - Retorna verdadeiro se as credenciais do corpo de autenticação
 *                     corresponderem às credenciais da API, caso contrário, retorna falso.
 */
const apiAuth = (authBody) => {
    // Obtém as credenciais da API do ambiente
    const { MC_CLIENT_ID, MC_CLIENT_SECRET, MC_ACCOUNT_ID } = process.env;
    const apiCredentials = {
        "client_id": MC_CLIENT_ID,
        "client_secret": MC_CLIENT_SECRET,
        "account_id": MC_ACCOUNT_ID
    };

    // Obtém as chaves dos objetos de credenciais da API e do corpo da autenticação
    const keysCredentials = Object.keys(apiCredentials);
    const keyAuthBody = Object.keys(authBody);

    // Verifica se o número de chaves nos objetos é o mesmo
    if (keysCredentials.length !== keyAuthBody.length) {
        return false;
    }

    // Verifica se as chaves e valores correspondem entre os objetos de credenciais da API e do corpo da autenticação
    for (let chave of keyAuthBody) {
        if (!apiCredentials.hasOwnProperty(chave) || authBody[chave] !== apiCredentials[chave]) {
            return false;
        }
    }

    // Retorna verdadeiro se as credenciais do corpo de autenticação corresponderem às credenciais da API
    return true;
};

// Exporta a função apiAuth para ser utilizada em outros módulos
module.exports = { apiAuth };
