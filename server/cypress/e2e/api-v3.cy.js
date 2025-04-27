describe('API Tests for /customers Endpoint', () => {
   const baseUrl = Cypress.env('API_URL') || 'http://localhost:3001'
 
   context('Successful requests', () => {
     it('retrieves customers with default query parameters', () => {
       // Arrange
       const expectedKeys = ['customers', 'pageInfo']
 
       // Act
       cy.request('GET', `${baseUrl}/customers`).then(({ status, body }) => {
         // Assert
         expect(status).to.eq(200)
 
         const { customers, pageInfo } = body
         expect(Object.keys(body)).to.include.members(expectedKeys)
         expect(customers).to.be.an('array')
         expect(pageInfo).to.include.keys(['currentPage', 'totalPages', 'totalCustomers'])
       })
     })
 
     it('retrieves customers filtered by size', () => {
       // Arrange
       const size = 'Medium'
 
       // Act
       cy.request('GET', `${baseUrl}/customers?size=${size}`).then(({ status, body }) => {
         // Assert
         expect(status).to.eq(200)
 
         const { customers } = body
         expect(customers).to.be.an('array')
         customers.forEach(customer => {
           expect(customer.size).to.eq(size)
           expect(customer.employees).to.be.gte(100).and.lt(1000)
         })
       })
     })
 
     it('retrieves customers filtered by industry', () => {
       // Arrange
       const industry = 'Technology'
 
       // Act
       cy.request('GET', `${baseUrl}/customers?industry=${industry}`).then(({ status, body }) => {
         // Assert
         expect(status).to.eq(200)
 
         const { customers } = body
         expect(customers).to.be.an('array')
         customers.forEach(customer => {
           expect(customer.industry).to.eq(industry)
         })
       })
     })
 
     it('retrieves customers with pagination', () => {
       // Arrange
       const page = 2
       const limit = 5
 
       // Act
       cy.request('GET', `${baseUrl}/customers?page=${page}&limit=${limit}`).then(({ status, body }) => {
         // Assert
         expect(status).to.eq(200)
 
         const { pageInfo, customers } = body
         expect(pageInfo.currentPage).to.eq(page)
         expect(customers).to.have.length.of.at.most(limit)
       })
     })
   })
 
   context('Failed requests', () => {
     it('returns 400 for invalid page parameter (negative value)', () => {
       // Arrange
       const page = -1
 
       // Act
       cy.request({
         method: 'GET',
         url: `${baseUrl}/customers?page=${page}`,
         failOnStatusCode: false,
       }).then(({ status, body }) => {
         // Assert
         expect(status).to.eq(400)
         expect(body).to.have.property('error')
         expect(body.error).to.eq('Invalid page or limit. Both must be positive numbers.')
       })
     })
 
     it('returns 400 for invalid limit parameter (zero value)', () => {
       // Arrange
       const limit = 0
 
       // Act
       cy.request({
         method: 'GET',
         url: `${baseUrl}/customers?limit=${limit}`,
         failOnStatusCode: false,
       }).then(({ status, body }) => {
         // Assert
         expect(status).to.eq(400)
         expect(body).to.have.property('error')
         expect(body.error).to.eq('Invalid page or limit. Both must be positive numbers.')
       })
     })
 
     it('returns 400 for unsupported size value', () => {
       // Arrange
       const size = 'InvalidSize'
 
       // Act
       cy.request({
         method: 'GET',
         url: `${baseUrl}/customers?size=${size}`,
         failOnStatusCode: false,
       }).then(({ status, body }) => {
         // Assert
         expect(status).to.eq(400)
         expect(body).to.have.property('error')
         expect(body.error).to.eq(
           'Unsupported size value. Supported values are All, Small, Medium, Enterprise, Large Enterprise, and Very Large Enterprise.'
         )
       })
     })
 
     it('returns 400 for unsupported industry value', () => {
       // Arrange
       const industry = 'InvalidIndustry'
 
       // Act
       cy.request({
         method: 'GET',
         url: `${baseUrl}/customers?industry=${industry}`,
         failOnStatusCode: false,
       }).then(({ status, body }) => {
         // Assert
         expect(status).to.eq(400)
         expect(body).to.have.property('error')
         expect(body.error).to.eq(
           'Unsupported industry value. Supported values are All, Logistics, Retail, Technology, HR, and Finance.'
         )
       })
     })
   })
 })