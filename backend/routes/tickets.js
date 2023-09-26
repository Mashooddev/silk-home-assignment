var express = require("express");
var router = express.Router();
require("dotenv").config();

const ticketController = require("../controllers/ticketController");

router.get("/list", ticketController.listTickets);
router.post("/add", ticketController.addTicket);
router.put("/update/:id", ticketController.updateTicket);
router.put("/complete/:id", ticketController.completeTicket);
router.put("/open/:id", ticketController.openTicket);
router.get("/get/:id", ticketController.getTicket);
router.delete("/delete/:id", ticketController.deleteTicket);

module.exports = router;
