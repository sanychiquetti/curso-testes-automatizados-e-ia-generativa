import React from 'react';
import { ThankYouPage } from './ThankYouPage';

describe('ThankYouPage', () => {
   const mockOrderNumber = '12345';
  beforeEach(() => {
   const mockOnBackToStore = cy.stub().as('mockOnBackToStore');
    cy.mount(
      <ThankYouPage 
         orderNumber={mockOrderNumber} 
         onBackToStore={mockOnBackToStore} 
      />
    );
  });

  it('deve renderizar o título corretamente e mensagem de confirmação', () => {
    cy.contains('Thank You for Your Purchase!').should('be.visible');
    cy.contains("Your order has been successfully placed. We've sent a confirmation email with your order details.")
      .should('be.visible');
  });

  it('deve exibir o número do pedido corretamente', () => {
    cy.contains('Order Number').should('be.visible');
    cy.contains(mockOrderNumber).should('be.visible');
  });

  it('deve chamar a função onBackToStore ao clicar no botão', () => {
    cy.contains('button', 'Back to Store').click();
    cy.get('@mockOnBackToStore').should('have.been.calledOnce');
  });

  it('deve renderizar o ícone de checkmark', () => {
    cy.get('svg').should('have.class', 'text-green-500');
  });

  it('deve ter estilos corretos', () => {
   cy.get('.min-h-screen')
     .should('have.css', 'background-color', 'rgb(243, 244, 246)') 
     .and('have.css', 'display', 'flex')
     .and('have.css', 'justify-content', 'center')
     .and('have.css', 'align-items', 'center');
 
   cy.get('.bg-white')
     .should('have.css', 'background-color', 'rgb(255, 255, 255)') 
     .and('have.css', 'padding', '32px') 
     .and('have.css', 'border-radius', '8px') 
 
   cy.get('.text-green-500')
     .should('have.css', 'color', 'rgb(34, 197, 94)'); 
 });
});
