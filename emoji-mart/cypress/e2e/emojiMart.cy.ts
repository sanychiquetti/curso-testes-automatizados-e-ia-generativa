describe('Emoji Mart App', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173/');
  });

  it('should display the homepage with a list of emojis', () => {
    cy.get('h1').contains('EmojiMart');
    cy.get('input[placeholder="Search emojis..."]').should('be.visible');
    cy.get('[data-testid="emoji-card"]')
      .should('have.length', 6) // Assuming there are 6 emojis
      .and('be.visible');
  });

  it('should filter emojis based on search input', () => {
    cy.get('input[placeholder="Search emojis..."]').type('Rocket');

    cy.get('[data-testid="emoji-card"]').should('have.length', 1);
    cy.get('[data-testid="emoji-card"]')
      .contains('🚀')
      .should('be.visible');
  });

  it('should add an emoji to the cart', () => {
    cy.get('[data-testid="emoji-card"]').contains('😊').click();

    cy.contains('button', 'Add to Cart').click();
    cy.get('.lucide-shopping-cart').click()

    cy.get('[data-testid="cart-item"]')
      .contains('😊')
      .should('be.visible');
  });

  it('should remove an emoji from the cart', () => {
    cy.get('[data-testid="emoji-card"]').contains('😊').click();
    cy.contains('button', 'Add to Cart').click();
    cy.get('.lucide-shopping-cart').click()

    cy.get('[data-testid="cart-item"]')
      .contains('😊')
      .should('be.visible');

    cy.get('button svg.lucide-trash2').click();

    cy.get('[data-testid="empty-cart"]')
      .contains('Your cart is empty')
      .should('be.visible');
  });

  it('should update the quantity of an emoji in the cart', () => {
    cy.get('[data-testid="emoji-card"]')
      .contains('😊')
      .click();
    cy.contains('button', 'Add to Cart').click();
    cy.get('.lucide-shopping-cart').click()

    cy.get('[data-testid="cart-item"]')
      .contains('😊')
      .should('be.visible');

    cy.get('button svg.lucide-plus-circle').click();

    cy.get('[data-testid="cart-item-counter"]')
      .contains('2')
      .should('be.visible');
  });

  context.only('Testes adicionais para cobrir as lacunas encontratas pelo Copilot', () => { 
    it('should navigate to the emoji details page and display information', () => {
      cy.get('[data-testid="emoji-card"]').contains('😊').click();
      cy.get('.text-gray-600').should('have.text', 'A classic yellow smiling face showing happiness and joy');
      cy.contains('button', 'Add to Cart').should('be.visible');
    });
  
    it('should complete the checkout process', () => {
      cy.get('[data-testid="emoji-card"]').contains('😊').click();
      cy.contains('button', 'Add to Cart').click();
      cy.get('.lucide-shopping-cart').click();
      cy.contains('button', 'Checkout').click();
  
      cy.get('#email').type('test@example.com');
      cy.get('#name').type('John Doe');
      cy.get('#address').type('123 Emoji St.');
      cy.get('input[name="city"]').type('Emoji City');
      cy.get('input[name="country"]').type('EmojiLand');
      cy.get('input[name="cardNumber"]').type('4111111111111111');
      cy.get('input[name="expiryDate"]').type('12/30');
      cy.get('input[name="cvv"]').type('123');
      cy.contains('button', 'Complete Purchase').click();
  
      cy.get('h1').contains('Thank You for Your Purchase!').should('be.visible');
      cy.contains('Your order has been successfully placed').should('be.visible');
      cy.get('p.text-lg.font-semibold')
      .invoke('text').should('not.be.empty');
    });
  
    it('should perform a case-insensitive search', () => {
      cy.get('input[placeholder="Search emojis..."]').type('rocket');
      cy.get('[data-testid="emoji-card"]').contains('🚀').should('be.visible');
    });
  
    it('should be responsive for mobile screen sizes', () => {
      cy.viewport('iphone-x');
      cy.get('h1').contains('EmojiMart').should('be.visible');
      cy.get('input[placeholder="Search emojis..."]').should('be.visible');
    });
  })
});
