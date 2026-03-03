const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: { type: String, enum: ["credit", "debit"], required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

const clientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: false, default: "" },
    transactions: [transactionSchema],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);

clientSchema.methods.getTotals = function () {
  let credit = 0,
    debit = 0;
  this.transactions.forEach((t) => {
    if (t.type === "credit") credit += t.amount;
    else if (t.type === "debit") debit += t.amount;
  });
  return { credit, debit, balance: credit - debit };
};

module.exports = mongoose.model("Client", clientSchema);
