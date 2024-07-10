import Cypress from '.';

describe('проверяем доступность приложения', function() {
  it('сервис должен быть доступен по адресу localhost:4000', function() {
    cy.visit('http://localhost:4000'); 
  });
}); 

describe('Тестирование добавления ингредиента из списка в конструктор', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4000');
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('loadIngredients');

    // Инициализация алиасов для частей интерфейса
    cy.get('[data-cy=bun-ingredients]').as('bunIngredients');
    cy.get('[data-cy=mains-ingredients]').as('mainsIngredients');
    cy.get('[data-cy=sauces-ingredients]').as('saucesIngredients');
    cy.get('[data-cy=constructor-ingredients]').as('constructorIngredients');
  });

  it('добавление булки и начинки', () => {
    // Ожидание загрузки данных ингредиентов
    cy.wait('@loadIngredients');

    // Добавление булки в конструктор
    cy.get('@bunIngredients')
      .children().first()
      .should('be.visible')
      .click();

    // Добавление начинки
    cy.get('@mainsIngredients')
      .children().first()
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .click({ force: true });

    // Добавление соуса
    cy.get('@saucesIngredients')
      .children().first()
      .scrollIntoView({ duration: 1000 })
      .should('be.visible')
      .click({ force: true });
  });
});

describe('Модальное окно ингредиента', () => {

  beforeEach(() => {
    cy.visit('http://localhost:4000');
  });

  it('Открывает модальное окно', () => {
    cy.openModalByText('Филе Люминесцентного тетраодонтимформа');
  });

  it('Закрывает модальное окно по клику на иконку закрыть', () => {
    cy.openModalByText('Филе Люминесцентного тетраодонтимформа');
    cy.closeModalByIcon();
  });

  it('Закрывает модальное окно по клику на overlay', () => {
    cy.openModalByText('Филе Люминесцентного тетраодонтимформа');
    cy.closeModalByOverlay();
  });
});

describe('Модальное окно заказа', () => {
  beforeEach(() => {
    cy.setupIntercepts();
    cy.prepareEnvironment();
    cy.setAliasForIngredients();
  });

  afterEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Заказывает бургер и закрывает модальное окно', () => {
    cy.placeOrder();
    cy.validateOrderAndCloseModal();
  });
});

