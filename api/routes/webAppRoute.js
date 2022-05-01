const express = require("express");
const { isAuthenticatedUserAndContinueRequest, authorizeRolesAndContinueRequest } = require("../middleware/auth");
const router = express.Router();
const path = require("path");

// file path
let srcDir = "";

// load build files in production
if (process.env.NODE_ENV === "DEVELOPMENT") {
    srcDir = "../../src/admin/webapp"
} else {
    srcDir = "../../src/admin/dist";
}

// check authentication & authorization
router
    .route("*")
    .get(isAuthenticatedUserAndContinueRequest,
        (req, res, next) => {
            if (req.user === null) {
                return res.sendFile(path.resolve(__dirname, `${srcDir}/login.html`));
            }

            next()
        });

// if no url provide navigate to index.html
router
    .route("/")
    .get((req, res, next) => {
        return res.sendFile(path.resolve(__dirname, `${srcDir}/index.html`));
    })


module.exports = router;