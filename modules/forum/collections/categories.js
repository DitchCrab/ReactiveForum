const Categories = new Mongo.Collection("categories");

let Schemas = {};
Schemas.Category = new SimpleSchema({
  name: {
    type: String,
    label: "Category name",
    max: 20
  }
});

Categories.attachSchema(Schemas.Category);

export default Categories;
