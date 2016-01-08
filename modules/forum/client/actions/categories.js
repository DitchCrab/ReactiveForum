export function getCategories() {
  let categories = Categories.find().fetch();
  return {
    type: GET_CATEGORIES,
    categories: categories
  }
};
