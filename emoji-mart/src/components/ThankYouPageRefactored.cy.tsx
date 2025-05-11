import React from 'react';
import { ThankYouPage } from './ThankYouPage';

describe('ThankYouPage', () => {
  const mockOrderNumber = '12345';
  const selectors = {
    title: 'Thank You for Your Purchase!',
    confirmationMessage: "Your order has been successfully placed. We've sent a confirmation email with your order details.",
    orderNumberLabel: 'Order Number',
    backToStoreButton: 'button:contains("Back to Store")',
    container: '.min-h-screen',
    card: '.bg-white',
    checkmarkIcon: '.text-green-500',
  };

  beforeEach(() => {
    const mockOnBackToStore = cy.stub().as('mockOnBackToStore');
    cy.mount(
      <ThankYouPage
        orderNumber={mockOrderNumber}
        onBackToStore={mockOnBackToStore}
      />
    );
  });

  it('deve renderizar o título e a mensagem de confirmação corretamente', () => {
    cy.contains(selectors.title).should('be.visible');
    cy.contains(selectors.confirmationMessage).should('be.visible');
  });

  it('deve exibir o número do pedido corretamente', () => {
    cy.contains(selectors.orderNumberLabel).should('be.visible');
    cy.contains(mockOrderNumber).should('be.visible');
  });

  it('deve chamar a função onBackToStore ao clicar no botão', () => {
    cy.get(selectors.backToStoreButton).click();
    cy.get('@mockOnBackToStore').should('have.been.calledOnce');
  });

  it('deve renderizar o ícone de checkmark corretamente', () => {
    cy.get(selectors.checkmarkIcon).should('have.class', 'text-green-500');
  });

  it('deve ter estilos corretos', () => {
    // Verifica o estilo do contêiner principal
    cy.get(selectors.container)
      .should('have.css', 'background-color', 'rgb(243, 244, 246)') // bg-gray-100
      .and('have.css', 'display', 'flex')
      .and('have.css', 'justify-content', 'center')
      .and('have.css', 'align-items', 'center');

    // Verifica o estilo do cartão
    cy.get(selectors.card)
      .should('have.css', 'background-color', 'rgb(255, 255, 255)') // bg-white
      .and('have.css', 'padding', '32px') // p-8
      .and('have.css', 'border-radius', '8px'); // rounded-lg

    // Verifica o estilo do ícone de checkmark
    cy.get(selectors.checkmarkIcon)
      .should('have.css', 'color', 'rgb(34, 197, 94)'); // text-green-500
  });
});