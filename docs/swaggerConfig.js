import swaggerJsDoc from "swagger-jsdoc";



const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Job Portal API Documentation",
    version: "1.0.0",
    description: "API documentation for the Job Portal application",
    contact: {
      name: "API Support",
      email: "support@jobportal.com",
    },
  },
  servers: [
    {
      url: "http://localhost:6000/api",
      description: "Development server",
    },
  ],
};


const options = {
  swaggerDefinition,
  apis: ["../routes/*.js", "../controllers/*.js"],
};


const swaggerSpec = swaggerJsDoc(options);

export default swaggerSpec;
