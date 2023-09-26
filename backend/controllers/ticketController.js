const ticket_schema = require("../utils/Schema/Sector/ticket");
const MongoClient = require("mongodb").MongoClient;
const client = new MongoClient(process.env.DATABASE_URI);
// const bcrypt = require("bcrypt");

const { ObjectId } = require("mongodb");

module.exports = {
  listTickets: async function (req, res, next) {
    try {
      const list = await client
        .db(process.env.DATA_BASE)
        .collection("tickets")
        .find()
        .toArray();
      if (list === null || list.length === 0) {
        res.json({
          message: "No Data Found",
          result: true,
        });
      } else {
        res.json({ list, result: true });
      }
    } catch (e) {
      console.log("ERROR is", e);
      res.status(500).json({
        message:
          "There was a problem in retriving the users list, please try again.",
        result: false,
      });
    }
  },
  getTicket: async function (req, res, next) {
    try {
      const list = await client
        .db(process.env.DATA_BASE)
        .collection("tickets")
        .findOne({ _id: new ObjectId(req.params.id) });
      if (list === null || list.length === 0) {
        res.json({
          message: "No Ticket Found",
          result: true,
        });
      } else {
        res.json({ list, result: true });
      }
    } catch (e) {
      console.log("ERROR is", e);
      res.status(500).json({
        message:
          "There was a problem in retriving the users list, please try again.",
        result: false,
      });
    }
  },
  addTicket: async function (req, res, next) {
    try {
      const { error } = ticket_schema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errorDetails = error.details.map((err) => {
          return {
            field: err.path[0],
            message: err.message,
          };
        });

        return res.status(400).json({ errors: errorDetails });
      }
      const event = {
        title: req.body.title,
        description: req.body.description,
        source: req.body.source,
        status: req.body.status,
        priority: req.body.priority,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const sector = await client
        .db(process.env.DATA_BASE)
        .collection("tickets")
        .insertOne(event);

      if (sector.insertedId) {
        res.json({
          message: "Ticket added successfully!",
          result: true,
        });
      }
    } catch (e) {
      console.log("ERROR is", e);
      res.status(500).json({
        message:
          "There was a problem in retriving the users list, please try again.",
        result: false,
      });
    }
  },
  deleteTicket: async function (req, res, next) {
    try {
      const ticket = await client
        .db(process.env.DATA_BASE)
        .collection("tickets")
        .deleteOne({ _id: new ObjectId(req.params.id) });

      console.log(ticket);
      if (ticket === null || ticket.length === 0) {
        res.json({
          message: "Ticket not found!",
          result: true,
        });
      } else {
        res.json({
          message: "Your Ticket has been Deleted Successfully!",
          result: true,
        });
      }
    } catch (e) {
      console.log("ERROR is", e);
      res.status(500).json({
        message:
          "There was a problem in retriving the users list, please try again.",
        result: false,
      });
    }
  },
  updateTicket: async function (req, res, next) {
    try {
      const { error } = ticket_schema.validate(req.body, {
        abortEarly: false,
      });

      if (error) {
        const errorDetails = error.details.map((err) => {
          return {
            field: err.path[0],
            message: err.message,
          };
        });

        return res.status(400).json({ errors: errorDetails });
      }
      const selectedTicket = await client
        .db(process.env.DATA_BASE)
        .collection("tickets")
        .findOne({ _id: new ObjectId(req.params.id) });
      if (selectedTicket === null || selectedTicket.length === 0) {
        res.json({
          message: "Ticket not found!",
          result: true,
        });
      } else {
        const ticket = await client
          .db(process.env.DATA_BASE)
          .collection("tickets")
          .updateOne(
            { _id: new ObjectId(req.params.id) },
            {
              $set: {
                title: req.body.title,
                description: req.body.description,
                source: req.body.source,
                priority: req.body.priority,
                updatedAt: new Date(),
              },
            }
          );
        console.log(ticket);
        res.json({
          message: "Your Ticket has been Updated Successfully!",
          result: true,
        });
      }
    } catch (e) {
      console.log("ERROR is", e);
      res.status(500).json({
        message:
          "There was a problem in retriving the users list, please try again.",
        result: false,
      });
    }
  },
  completeTicket: async function (req, res, next) {
    try {
      const selectedTicket = await client
        .db(process.env.DATA_BASE)
        .collection("tickets")
        .findOne({ _id: new ObjectId(req.params.id) });
      if (selectedTicket === null || selectedTicket.length === 0) {
        res.json({
          message: "Ticket not found!",
          result: true,
        });
      } else {
        const ticket = await client
          .db(process.env.DATA_BASE)
          .collection("tickets")
          .updateOne(
            { _id: new ObjectId(req.params.id) },
            {
              $set: {
                status: "Complete",
                updatedAt: new Date(),
              },
            }
          );
        console.log(ticket);
        res.json({
          message: "Your Ticket has been Updated Successfully!",
          result: true,
        });
      }
    } catch (e) {
      console.log("ERROR is", e);
      res.status(500).json({
        message:
          "There was a problem in retriving the users list, please try again.",
        result: false,
      });
    }
  },
  openTicket: async function (req, res, next) {
    try {
      const selectedTicket = await client
        .db(process.env.DATA_BASE)
        .collection("tickets")
        .findOne({ _id: new ObjectId(req.params.id) });
      if (selectedTicket === null || selectedTicket.length === 0) {
        res.json({
          message: "Ticket not found!",
          result: true,
        });
      } else {
        const ticket = await client
          .db(process.env.DATA_BASE)
          .collection("tickets")
          .updateOne(
            { _id: new ObjectId(req.params.id) },
            {
              $set: {
                status: "Open",
                updatedAt: new Date(),
              },
            }
          );
        console.log(ticket);
        res.json({
          message: "Your Ticket has been Updated Successfully!",
          result: true,
        });
      }
    } catch (e) {
      console.log("ERROR is", e);
      res.status(500).json({
        message:
          "There was a problem in retriving the users list, please try again.",
        result: false,
      });
    }
  },
};
