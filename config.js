const swaggerUI = require("swagger-ui-express")
const YAML = require("yamljs")
const swaggerJSDocs = YAML.load("./api.yaml")

const options = {
    customCss: `img {content: url(\'../pics/user_icon.png\'); height: auto;}`,
    customSiteTitle: "Code Improve API",
}

module.exports = {
    swaggerServer: swaggerUI.serve,
    swaggerSetup: swaggerUI.setup(swaggerJSDocs, options)
}