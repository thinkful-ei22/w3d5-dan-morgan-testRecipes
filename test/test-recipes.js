'use strict';

const chai = require('chai');
const chaiHTTP = require('chai-http');

const expect = chai.expect;
chai.use(chaiHTTP);

const { app, runServer, closeServer } = require('../server.js');

describe('recipes', function() {

  before(function(){
    return runServer();
  });

  after(function(){
    return closeServer();
  });

  it('should return all recipes when GET request is made', function(){
    return chai.request(app)
      .get('/recipes')
      .then(function(response){
        expect(response).to.have.status(200);
        expect(response).to.be.json;
        expect(response.body).to.be.a('array');
        const expectedKeys = ['name', 'ingredients'];
        response.body.forEach( recipe => {
          expect(recipe).to.include.keys(expectedKeys);
        });
      });
  });
});