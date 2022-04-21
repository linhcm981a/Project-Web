const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");

mongoose.plugin(slug);

const OrderTable = new Schema(
  {
    name: { type: String, require: true },
    address: { type: String, maxLength: 600 },
    email: { type: String, maxLength: 255 },
    phone: { type: String, maxLength: 255 },
    total: { type: String, maxLength: 255 },
    products: { type: String, maxLength: 255 },
    ordertotal: { type: String, maxLength: 255 },
    slug: { type: String, slug: "name", unique: true },
  },
  {
    timestamps: true,
  }
);

// Add plugins
mongoose.plugin(slug);
OrderTable.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});


module.exports=mongoose.model('ordertables',OrderTable); 
