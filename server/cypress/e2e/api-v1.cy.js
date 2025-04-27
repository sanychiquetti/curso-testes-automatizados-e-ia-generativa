describe('API Tests for /customers Endpoint', () => {
  const baseUrl = 'http://localhost:3001/customers';

  it('should fetch customers with default parameters', () => {
    cy.request('GET', baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers');
      expect(response.body.customers).to.be.an('array');
      expect(response.body).to.have.property('pageInfo');
      expect(response.body.pageInfo).to.have.keys(['currentPage', 'totalPages', 'totalCustomers']);
    });
  });

  it('should fetch customers with specific query parameters', () => {
    const queryParams = {
      page: 2,
      limit: 10,
      size: 'Medium',
      industry: 'Technology',
    };

    cy.request({
      method: 'GET',
      url: baseUrl,
      qs: queryParams,
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('customers');
      expect(response.body.customers).to.be.an('array');
      response.body.customers.forEach((customer) => {
        expect(customer.size).to.eq(queryParams.size);
        expect(customer.industry).to.eq(queryParams.industry);
      });

      expect(response.body.pageInfo.currentPage).to.eq(queryParams.page);
    });
  });

  it('should return 400 for invalid page or limit values', () => {
    const invalidQueries = [
      { page: -1 },
      { limit: 'abc' },
      { page: 'invalid', limit: 10 },
    ];

    invalidQueries.forEach((query) => {
      cy.request({
        method: 'GET',
        url: baseUrl,
        qs: query,
        failOnStatusCode: false, // to handle errors gracefully
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  it('should return 400 for unsupported size or industry values', () => {
    const invalidQueries = [
      { size: 'InvalidSize' },
      { industry: 'UnknownIndustry' },
    ];

    invalidQueries.forEach((query) => {
      cy.request({
        method: 'GET',
        url: baseUrl,
        qs: query,
        failOnStatusCode: false, // to handle errors gracefully
      }).then((response) => {
        expect(response.status).to.eq(400);
      });
    });
  });

  it('should handle customers without contactInfo or address', () => {
    cy.request('GET', baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        if (!customer.contactInfo) {
          expect(customer.contactInfo).to.be.null;
        }
        if (!customer.address) {
          expect(customer.address).to.be.null;
        }
      });
    });
  });

  it('should correctly calculate customer size based on employee count', () => {
    cy.request('GET', baseUrl).then((response) => {
      expect(response.status).to.eq(200);
      response.body.customers.forEach((customer) => {
        const employees = customer.employees;
        if (employees < 100) {
          expect(customer.size).to.eq('Small');
        } else if (employees >= 100 && employees < 1000) {
          expect(customer.size).to.eq('Medium');
        } else if (employees >= 1000 && employees < 10000) {
          expect(customer.size).to.eq('Enterprise');
        } else if (employees >= 10000 && employees < 50000) {
          expect(customer.size).to.eq('Large Enterprise');
        } else {
          expect(customer.size).to.eq('Very Large Enterprise');
        }
      });
    });
  });

  it('should filter customers by size', () => {
    const sizes = ['Small', 'Medium', 'Enterprise', 'Large Enterprise', 'Very Large Enterprise'];

    sizes.forEach((size) => {
      cy.request({
        method: 'GET',
        url: baseUrl,
        qs: { size },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('customers');
        expect(response.body.customers).to.be.an('array');
        response.body.customers.forEach((customer) => {
          expect(customer.size).to.eq(size);
        });
      });
    });
  });

  it('should filter customers by industry', () => {
    const industries = ['Logistics', 'Retail', 'Technology', 'HR', 'Finance'];

    industries.forEach((industry) => {
      cy.request({
        method: 'GET',
        url: baseUrl,
        qs: { industry },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('customers');
        expect(response.body.customers).to.be.an('array');
        response.body.customers.forEach((customer) => {
          expect(customer.industry).to.eq(industry);
        });
      });
    });
  });
});