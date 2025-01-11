const routes = require("express").Router();
const indexController = require("../controllers/index");

// Web page routes
routes.get("/", indexController.stephanieRoute);
routes.get("/Dallin", indexController.dallinRoute);

module.exports = routes;
