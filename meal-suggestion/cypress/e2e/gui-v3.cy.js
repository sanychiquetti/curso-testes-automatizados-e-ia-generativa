describe('Meal Suggestion App', () => {
   const baseUrl = 'https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html';
 
   beforeEach(() => {
     cy.visit(baseUrl);
   });
 
   it('deve carregar a página inicial corretamente', () => {
     cy.contains('h1', 'Refeição vegana').should('be.visible');
     cy.get('#meal-type-filter').should('have.value', 'all'); // Verifica o valor padrão do filtro
     cy.get('input[placeholder="Ex: Arroz e feijão"]').should('be.visible');
     cy.get('button').contains('Buscar').should('be.visible');
     cy.get('#meal-name').should('not.be.empty'); // Verifica que uma refeição é exibida
     cy.get('#ingredients-label').should('contain.text', 'Ingredientes:');
   });
 
   it('deve permitir filtrar refeições por tipo', () => {
     cy.get('#meal-type-filter').select('Pratos quentes'); 
     cy.get('button').contains('Buscar').click();
     cy.get('#meal-name').should('not.be.empty'); 
     cy.get('#ingredients-label').should('be.visible');
   });
 
   it('deve permitir buscar refeições por nome', () => {
     cy.get('input[placeholder="Ex: Arroz e feijão"]').type('Almôndegas de seitan');
     cy.get('button').contains('Buscar').click();
     cy.get('#meal-name').should('contain.text', 'Almôndegas de seitan'); 
     cy.get('#ingredients-label').should('be.visible');
   });
 
   it('deve exibir os ingredientes corretamente de uma refeição ao clicar nela', () => {
     cy.get('input[placeholder="Ex: Arroz e feijão"]').type('Almôndegas de seitan com arroz negro');
     cy.get('button').contains('Buscar').click();
     cy.get('#ingredients-label').should('contain.text', 'Ingredientes:');
     const expectedIngredients = [
       'almôndegas de seitan',
       'arroz negro',
       'molho de tomate',
       'ervilhas',
     ];
 
     cy.get('ul li').should('have.length', expectedIngredients.length); 
     expectedIngredients.forEach((ingredient, index) => {
       cy.get('ul li').eq(index).should('contain.text', ingredient); 
     });
   });
 
   it('deve alterar o tipo de refeição e exibir pratos adequados', () => {
     cy.get('#meal-type-filter').select('Saladas')
      cy.get('#meal-name').invoke('text').should('match', /salada/i);
   });

   it('Deve exibir uma mensagem ou não atualizar quando a busca por pratos não existentes', () => {
      cy.get('#meal-name').invoke('text').then((currentMealName) => {
        cy.get('#search-field').type('Prato inexistente');
        cy.get('button').contains('Buscar').click();
    
        cy.get('#meal-name').should('have.text', currentMealName);
      });
    });
 });