// Importação de módulos
const axios = require('axios');
require('dotenv').config();

// Variáveis de ambiente
let auth = {};
const { MC_CLIENT_ID, MC_CLIENT_SECRET, MC_ACCOUNT_ID, MARKETING_CLOUD_AUTH_URL } = process.env;

/**
 * Função para realizar a autenticação na Marketing Cloud utilizando o fluxo de concessão client_credentials.
 * @returns {Promise<Object>} Objeto contendo informações do token de acesso.
 */
const authenticate = async () => {
  let token = '';
  try {
    const response = await axios.post(MARKETING_CLOUD_AUTH_URL, {
      "grant_type": "client_credentials",
      "client_id": MC_CLIENT_ID,
      "client_secret": MC_CLIENT_SECRET,
      "account_id": MC_ACCOUNT_ID
    });
    token = response.data;
  } catch (error) {
    console.error(error);
  }
  return token;
};

/**
 * Função para verificar se o token de acesso está expirado.
 * @param {Object} token - Objeto contendo informações do token de acesso.
 * @returns {boolean} Retorna true se o token estiver expirado ou não existir, e false caso contrário.
 */
function isTokenExpired(token) {
  if (!token || !token.expires_in) {
    return true;
  }

  const expiresInMilliseconds = token.expires_in * 1000;
  const expirationTime = token.timestamp + expiresInMilliseconds;

  return expirationTime < Date.now();
}

/**
 * Função para obter um token de acesso, atualizando-o se necessário.
 * @returns {Promise<string>} Token de acesso atualizado.
 */
const refreshToken = async () => {
  if (isTokenExpired(auth)) {
    const newToken = await authenticate();
    auth = {
      access_token: newToken.access_token,
      expires_in: newToken.expires_in,
      timestamp: Date.now(),
    };
  }
  return auth.access_token;
};

module.exports = { refreshToken };
