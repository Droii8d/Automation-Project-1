beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_3.html')
})

it('Check that radio button list is correct', () => {
    cy.get('input[type="radio"]').should('have.length', 4)

    cy.get('input[type="radio"]').next().eq(0).should('have.text','Daily')
    cy.get('input[type="radio"]').next().eq(1).should('have.text','Weekly')
    cy.get('input[type="radio"]').next().eq(2).should('have.text','Monthly')
    cy.get('input[type="radio"]').next().eq(3).should('have.text','Never')
    cy.get(':radio').should('not.be.checked')

    cy.get('input[type="radio"]').eq(0).check().should('be.checked')
    cy.get('input[type="radio"]').eq(1).check().should('be.checked')
    cy.get('input[type="radio"]').eq(0).should('not.be.checked')
    cy.get('input[type="radio"]').eq(2).check().should('be.checked')
    cy.get('input[type="radio"]').eq(3).should('not.be.checked')
    cy.get('input[type="radio"]').eq(2).check().should('be.checked')
})

it('Check that country dropdown is correct', () => {
    cy.get('#country').children().should('have.length', 4)
    cy.get('#country').find('option').eq(0).should('have.text', '')
    cy.get('#country').find('option').eq(1).should('have.text', 'Spain')
    cy.get('#country').find('option').eq(2).should('have.text', 'Estonia')
    cy.get('#country').find('option').eq(3).should('have.text', 'Austria')
    cy.get('#country').should('not.be.selected')
})

it('Selecting country changes the list of cities, the list is correct and country/city dependencies are correct', () => {
    cy.get('#country').select('Spain')
    cy.get('#city').children().should('have.length', 5)
    cy.get('#city').find('option').eq(0).should('have.text', '')
    cy.get('#city').find('option').eq(1).should('have.text', 'Malaga')
    cy.get('#city').find('option').eq(2).should('have.text', 'Madrid')
    cy.get('#city').find('option').eq(3).should('have.text', 'Valencia')
    cy.get('#city').find('option').eq(4).should('have.text', 'Corralejo')
    cy.get('#city').select('Madrid')

    cy.get('#country').select('Estonia')
    cy.get('#city').should('not.contain', 'Madrid')
    cy.get('#city').children().should('have.length', 4)
    cy.get('#city').find('option').eq(0).should('have.text', '')
    cy.get('#city').find('option').eq(1).should('have.text', 'Tallinn')
    cy.get('#city').find('option').eq(2).should('have.text', 'Haapsalu')
    cy.get('#city').find('option').eq(3).should('have.text', 'Tartu')
    cy.get('#city').select('Tartu')
    
    cy.get('#country').select('Austria')
    cy.get('#city').should('not.contain', 'Tartu')
    cy.get('#city').children().should('have.length', 4)
    cy.get('#city').find('option').eq(0).should('have.text', '')
    cy.get('#city').find('option').eq(1).should('have.text', 'Vienna')
    cy.get('#city').find('option').eq(2).should('have.text', 'Salzburg')
    cy.get('#city').find('option').eq(3).should('have.text', 'Innsbruck')
    cy.get('#city').select('Vienna')

    cy.get('#country').select('')
    cy.get('#city').should('not.contain', 'Vienna')

})

it('Check that check box list is correct and check boxes can be checked and unchecked', () => {
    cy.get('input[type="checkbox"]').should('have.length', 2)
    cy.get(':checkbox').should('not.be.checked')
    cy.get(':checkbox').check().should('be.checked')
    cy.get(':checkbox').uncheck().should('not.be.checked')
  
})

it('Check that cookie policy link is working', () => {
    cy.get('button')
    .find("a")
    .should("have.attr", "href", "cookiePolicy.html")
    .should("have.text", "Accept our cookie policy")
    .click()
    cy.url().should('contain', '/cookiePolicy.html')
    cy.go('back')
})

it('Email format validation', () => {
    cy.get('input[name="email"]').type('invalid')
    cy.get('#emailAlert').should('be.visible').and('contain.text', 'Invalid email address.')
    cy.get('input[name="email"]').scrollIntoView()
    cy.get('input[name="email').clear()
    cy.get('input[name="email').type('correct@email.com')
    cy.get('#emailAlert').should('not.be.visible')


})
/*
BONUS TASK: add visual tests for registration form 3
Task list:
* Create test suite for visual tests for registration form 3 (describe block)
* Create tests to verify visual parts of the page:
    * radio buttons and its content
    * dropdown and dependencies between 2 dropdowns:
        * list of cities changes depending on the choice of country
        * if city is already chosen and country is updated, then city choice should be removed
    * checkboxes, their content and links
    * email format
 */


/*
BONUS TASK: add functional tests for registration form 3
Task list:
* Create second test suite for functional tests
* Create tests to verify logic of the page:
    * all fields are filled in + corresponding assertions
    * only mandatory fields are filled in + corresponding assertions
    * mandatory fields are absent + corresponding assertions (try using function)
    * add file functionlity(google yourself for solution!)
 */