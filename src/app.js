// Importação de módulos
const express = require('express');
const routes = require('./routes/apiRoute.js');
const app = express();
const PORT = process.env.PORT || 3000;

// Utiliza o roteador para tratar as requisições na raiz '/'
app.use('/', routes);

// Inicia o servidor na porta especificada
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
