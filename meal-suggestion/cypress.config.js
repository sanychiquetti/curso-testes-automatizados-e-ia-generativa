const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.js', // Define o padrão para os arquivos de teste
    baseUrl: 'https://meal-suggestion.s3.eu-central-1.amazonaws.com', // URL base da aplicação
  },
});