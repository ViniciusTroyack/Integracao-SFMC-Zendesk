# Integracao Marketing Cloud Zendesk

## Descrição
Esta aplicação realiza integrações entre a Marketing Cloud e o Zendesk, processando dados e atualizando registros.

## Estrutura de Pastas e Arquivos
A aplicação está organizada da seguinte forma:

- `controllers`: Contém os controladores que definem a lógica de processamento.
- `services`: Contém os serviços responsáveis por interagir com APIs externas.
- `routes`: Contém as definições de rotas da API.
- `app.js`: Configuração principal do servidor Express.

## Instalação
1. Clone o repositório ou extrai o projeto.
2. Execute `npm install` para instalar as dependências.

## Configuração
Certifique-se de configurar corretamente as variáveis de ambiente necessárias. Consulte os exemplos fornecidos nos arquivos `.env.example`.

## Execução
1. Execute `npm start` para iniciar o servidor.
2. Acesse as rotas definidas na API para processar dados.

## Rotas da API

### Processar Dados da Marketing Cloud
- **Rota:** `/process-users`
- **Método:** `POST`
- **Descrição:** Inicia o processamento de dados da Marketing Cloud.
- **Resposta de Sucesso:** 200 OK - "All data processed"
- **Resposta de Erro:** 500 Internal Server Error - Mensagem de erro detalhada.

### Pesquisar Usuários no Zendesk
- **Rota:** `/search-users`
- **Método:** `POST`
- **Descrição:** Inicia a pesquisa de usuários no Zendesk.
- **Resposta de Sucesso:** 200 OK - "All data processed"
- **Resposta de Erro:** 500 Internal Server Error - Mensagem de erro detalhada.

## Logs
Os logs da aplicação podem ser encontrados na data extension de erro dentro do Marketing Cloud em DE>INTEGRACAO>ZENDESK>LOGS


