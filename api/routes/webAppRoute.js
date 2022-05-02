const express = require("express");
const { isAuthenticatedUserAndContinueRequest, authorizeRolesAndContinueRequest } = require("../middleware/auth");
const router = express.Router();
const path = require("path");

// file path
let srcDir = "../../src";
let adminDir = "";

// load build files in production
if (process.env.NODE_ENV === "DEVELOPMENT") {
    adminDir = `${srcDir}/admin/webapp`;
} else {
    adminDir = `${srcDir}/admin/dist`;
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
        return res.sendFile(path.resolve(__dirname, `${adminDir}/index.html`));
    })


module.exports = router;