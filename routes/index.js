const routes = require("express").Router();
const baseController = require("../controllers");

routes.get("/", baseController.getName);

module.exports = routes;