const express = require("express");
const router = express.Router();
const ledgerController = require("../controllers/ledgerController");

router.get("/", ledgerController.listClients);
router.post("/client/:id/delete", ledgerController.deleteClient);
router.post("/transaction", ledgerController.addTransaction);
router.get("/search", ledgerController.searchClient);

module.exports = router;
