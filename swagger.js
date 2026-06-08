const swaggerAutogen = require("swagger-autogen")();

const doc = {
    info: {
        title: "Home Services API",
        description: "CSE341 Final Project"
    },
    host: "localhost:8181",
    schemes: ["http", "https"]
};

const outputFile = "./swagger-output.json";

const endpointsFiles = [
    "./server.js"
];

swaggerAutogen(outputFile, endpointsFiles, doc);