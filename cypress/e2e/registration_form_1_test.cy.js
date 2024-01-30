// Before each test (it...) open .html page
beforeEach(() => {
    cy.visit('cypress/fixtures/registration_form_1.html')
})

/*
Assignment 2:

 1. Update the name of test suite by adding you name: “This is first test suite, John Smith”
 2. Replace text ‘Password123’ in the first test with your own chosen password (2 places) - passwords should match
 3. Change phone number in the first test to 555666777
 4. Change the order of steps in the first test:
      -first set phone number
      -then 2 password fields
      -then username
 5. Add comment to the first test containing today’s date
 */

describe('This is first test suite, Davis Jonass', () => {
    it('User can submit data only when valid mandatory values are added', () => {
        // 25.01.2023
        cy.get('[data-testid="phoneNumberTestId"]').type('555666777')
        cy.get('#firstName').type('Davis')
        cy.get('#lastName').type('Jonass')
        cy.get('input[name="password"]').type('qwerty')
        cy.get('[name="confirm"]').type('qwerty')
        cy.get('#username').type('Something')

        //in order to activate submit button, user has to click somewhere outside the input field
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.enabled')
        cy.get('.submit_button').click()

        // Assert that both input and password error messages are not shown
        // next 2 lines check exactly the same, but using different approach
        cy.get('#input_error_message').should('not.be.visible')
        cy.get('#password_error_message').should('have.css', 'display', 'none')

        // Assert that success message is visible
        // next 2 lines check exactly the same, but using different approach
        cy.get('#success_message').should('be.visible')
        cy.get('#success_message').should('have.css', 'display', 'block')
    });


    it('User can use only same both first and validation passwords', () => {
        cy.get('#username').type('johnDoe')
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
        cy.get('input[name="password"]').type('Password123')
        cy.get('[name="confirm"]').type('Password123123')
        
        // type('{enter}') is clicking native enter button from thekeyboard
        // for example, to click backspace use '{backspace}'
        cy.get('[name="confirm"]').type('{enter}')

        // Scroll to bottom of the page
        cy.window().scrollTo('bottom')

        // Assert that password error message is visible, and message should contain 'Passwords do not match!
        cy.get('#password_error_message').should('be.visible').should('contain', 'Passwords do not match!')
        // Assert that success message is not visible
        cy.get('#success_message').should('not.be.visible')
        // Asserting that Submit button is disabled
        cy.get('.submit_button').should('be.disabled')
        // Assert that password confirmation input fields has attribute 'title' with text stating 'Both passwords should match'
        cy.get('input[name="confirm"]').should('have.attr', 'title', 'Both passwords should match')
    })

    it('User cannot submit data when username is absent', () => {
        cy.get('#username').type('johnDoe')
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
        cy.get("input[name='password']").type('Password123')
        cy.get('[name="confirm"]').type('Password123')

        // Scroll back to username input field
        cy.get('#username').scrollIntoView()
        cy.get('#username').clear()
        cy.get('h2').contains('Password').click()

        // Asserting that Submit button is disabled
        cy.get('.submit_button').should('be.disabled')

        // Assert that success message is not visible
        cy.get('#success_message').should('not.be.visible')

        // Assert that correct error message is visible and contain given text
        cy.get('#input_error_message').should('be.visible').should('contain', 'Mandatory input field is not valid or empty!')

        // Assert that username has tooltip with error message
        cy.get('input[name="username"]').should('have.attr', 'title').should('contain', 'Input field')

        // There are 2 options how to check error message visibility: using CSS or simply be.visible
        // none = not visible; block = visible
        cy.get('#input_error_message').should('be.visible')
        cy.get('#input_error_message').should('have.css', 'display', 'block')
    })

    /*
    Assignment 3: add the content to the following tests
    */

    it('User cannot submit data when phone number is absent', () => {
        cy.get('#username').type('johnDoe')
        cy.get('#firstName').type('Davis')
        cy.get('#lastName').type('Jonass')
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
        cy.get('input[name="password"]').type('Password123')
        cy.get('[name="confirm"]').type('Password123')
        cy.get('[placeholder="8775048423"]').scrollIntoView()
        cy.get('[placeholder="8775048423"]').clear()
        cy.get('input[placeholder="8775048423"]').should('have.attr', 'title').should('contain', 'Add phone number')
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        //cy.get('#success_message').should('have.css', 'display', 'none')
    })

    it('User cannot submit data when password and/or confirmation password is absent', () => {
        cy.get('#username').type('jD')
        cy.get('#firstName').type('Davis')
        cy.get('#lastName').type('Jonass')
        cy.get('[data-testid="phoneNumberTestId"]').type('10203040')
        
        cy.get('input[name="password"]').should('have.value', '')
        cy.get('[name="confirm"]').should('have.value', '')
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        
        cy.get('input[name="password"]').type('zero')
        cy.get('[name="confirm"]').should('have.value', '')
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')

        cy.get('input[name="password"]').scrollIntoView()
        cy.get('input[name="password"]').clear()
        cy.get('input[name="password"]').should('have.value', '')
        cy.get('[name="confirm"]').type('zero')
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
        cy.get('#password_error_message').should('have.css', 'display', 'block')
    })

    it('User cannot add letters to phone number', () => {
        cy.get('#username').type('jD')
        cy.get('#firstName').type('Davis')
        cy.get('#lastName').type('Jonass')
        cy.get('input[name="password"]').type('Password123')
        cy.get('[name="confirm"]').type('Password123')
        
        cy.get('[data-testid="phoneNumberTestId"]').type('abcd')
        cy.get('[data-testid="phoneNumberTestId"]').should('have.attr', 'type', 'number')
        
        cy.get('h2').contains('Password').click()
        cy.get('.submit_button').should('be.disabled')
        cy.get('#success_message').should('not.be.visible')
    })
})