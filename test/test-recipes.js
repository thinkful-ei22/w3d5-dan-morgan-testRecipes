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

  it('should create a new recipe with POST request', function (){
    const newRecipe = {name: 'salad', ingredients: ['lettuce', 'olive oil']};
    return chai.request(app)
      .post('/recipes')
      .send(newRecipe)
      .then(function(response){
        expect(response).to.have.status(201);
        expect(response).to.be.json;
        expect(response.body).to.be.a('object');
        const expectedKeys = ['name', 'ingredients'];
        expect(response.body).to.include.keys(expectedKeys);
        expect(response.body.id).to.not.equal(null);
        expect(response.body).to.deep.equal(
          Object.assign(newRecipe, {id: response.body.id}));
      });
  });
});