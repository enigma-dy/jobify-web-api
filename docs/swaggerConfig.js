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
      url: "https://jobify-web-api.onrender.com/api/v1",
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
