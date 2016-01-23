// Get the categories for browsing

import Categories from 'forum/collections/categories';
import {
  GET_CATEGORIES
} from '../constants';

export function getInitialCategories() {
  return dispatch => {
    Meteor.subscribe('categories', (err, res) => {
      if (typeof err === 'undefined') {
        return dispatch(getCategories());
      }
    }) 
  }  
};

export function getCategories() {
  let categories = Categories.find().fetch();
  return {
    type: GET_CATEGORIES,
    categories: categories
  }
};
