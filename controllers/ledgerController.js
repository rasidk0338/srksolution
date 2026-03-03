const Client = require("../models/Client");

exports.listClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ user: req.session.user._id });
    // compute overall totals
    const totals = clients.reduce(
      (acc, c) => {
        const t = c.getTotals();
        acc.credit += t.credit;
        acc.debit += t.debit;
        acc.balance += t.balance;
        return acc;
      },
      { credit: 0, debit: 0, balance: 0 },
    );
    res.render("ledger", { clients, totals, query: "" });
  } catch (err) {
    next(err);
  }
};

// removed addClient; functionality merged into addTransaction

exports.deleteClient = async (req, res, next) => {
  try {
    await Client.deleteOne({ _id: req.params.id, user: req.session.user._id });
    res.redirect("/ledger");
  } catch (err) {
    next(err);
  }
};

exports.addTransaction = async (req, res, next) => {
  try {
    let { clientName, clientMobile, type, amount, description } = req.body;

    // basic validation
    amount = parseFloat(amount);
    if (!clientName || isNaN(amount)) {
      // invalid input; redirect back
      return res.redirect("/ledger");
    }

    // try to find existing client by name
    let client = await Client.findOne({
      name: clientName,
      user: req.session.user._id,
    });

    // create if not found
    if (!client) {
      client = await Client.create({
        name: clientName,
        mobile: clientMobile || "",
        user: req.session.user._id,
      });
    }

    client.transactions.push({ type, amount, description });
    await client.save();
    res.redirect("/ledger");
  } catch (err) {
    next(err);
  }
};

exports.searchClient = async (req, res, next) => {
  try {
    const { q } = req.query;
    const clients = await Client.find({
      user: req.session.user._id,
      name: { $regex: q, $options: "i" },
    });
    const totals = clients.reduce(
      (acc, c) => {
        const t = c.getTotals();
        acc.credit += t.credit;
        acc.debit += t.debit;
        acc.balance += t.balance;
        return acc;
      },
      { credit: 0, debit: 0, balance: 0 },
    );
    res.render("ledger", { clients, totals, query: q });
  } catch (err) {
    next(err);
  }
};
