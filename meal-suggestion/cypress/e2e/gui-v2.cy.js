describe('Meal Suggestion App', () => {
   const baseUrl = 'https://meal-suggestion.s3.eu-central-1.amazonaws.com/index.html';
 
   beforeEach(() => {
     cy.visit(baseUrl);
   });
 
   it('deve carregar a página inicial corretamente', () => {
     cy.contains('h1', 'Refeição vegana').should('be.visible');
     cy.get('select').should('have.value', 'all'); 
     cy.get('input[placeholder="Ex: Arroz e feijão"]').should('be.visible');
     cy.contains('button', 'Buscar').should('be.visible');
     cy.get('#ingredients-label').should('contain.text', 'Ingredientes:');
   });
 
   it('deve permitir filtrar refeições por tipo', () => {
     cy.get('select').select('Sopas'); 
     cy.get('button').contains('Buscar').click();
     cy.get('#meal-name').should('not.be.empty'); 
     cy.get('#ingredients-label').should('be.visible');
   });
 
   it('deve permitir buscar refeições por nome', () => {
     cy.get('input[placeholder="Ex: Arroz e feijão"]').type('Salada');
     cy.get('button').contains('Buscar').click();
     cy.get('#meal-name').should('contain.text', 'Salada'); 
     cy.get('#ingredients-label').should('be.visible');
   });

   it.only('deve alterar o tipo de refeição e exibir uma nova sugestão', () => {
      cy.get('#meal-name').then(($currentMeal) => {
        const currentMealName = $currentMeal.text();
    
        cy.get('button').contains('Buscar').click();
    
        cy.get('#meal-name').should('not.have.text', currentMealName); 
        cy.get('#ingredients-label').should('be.visible'); 
      });
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
 });