describe('Meal Suggestion App', () => {
  const baseUrl = 'https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html';

  beforeEach(() => {
    cy.visit(baseUrl);
  });

  it('deve carregar a página inicial corretamente', () => {
    cy.contains('h1', 'Refeição vegana').should('be.visible');
    cy.get('#filter-container').should('be.visible');
    cy.get('#search-container').should('be.visible');
    cy.get('input[placeholder="Ex: Arroz e feijão"]').should('be.visible');
    cy.get('button').contains('Buscar').should('be.visible');
  });

  it('deve permitir filtrar refeições por categoria', () => {
    cy.get('#meal-type-filter').select('Sopas');
    cy.get('button').contains('Buscar').click();
    cy.get('#meal-name').should('not.be.empty');
    cy.get('#meal-container').find('#ingredients-label').should('be.visible');
  });

  it('deve permitir buscar refeições por nome', () => {
    cy.get('#search-field').type('Pasta');
    cy.get('button').contains('Buscar').click();
    cy.get('#meal-container').find('#ingredients-label').should('be.visible');
  });

  it('deve exibir os ingredientes de uma refeição ao clicar nela', () => {
    cy.get('ul li').first().click();
    cy.get('#ingredients-label').should('be.visible');
    cy.get('#ingredients-label').should('contain.text', 'Ingredientes');
  });
});