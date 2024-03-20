const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info:{
        title:"ChatMingle Backend API",
        description:"Description"
    },
    host:'localhost:5000'
};

const outputFile='./swagger-output.json';
const routes =['./server.js'];

swaggerAutogen(outputFile, routes, doc);