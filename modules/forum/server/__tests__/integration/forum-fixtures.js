import Categories from 'forum/collections/categories';
import Threads from 'forum/collections/threads';
import moment from 'moment';

Meteor.methods({
  'fixtures/removeAllUsers': function() {
    return Meteor.users.remove({});
  },
  
  'fixtures/removeAllCategories': function() {
    return Categories.remove({});
  },

  'fixtures/removeAllThreads': function() {
    return Threads.remove({});
  },

  'fixtures/create_user': function() {
    if (Meteor.users.find({username: 'MockUser'}).count() === 0) {
      Accounts.createUser({username: 'MockUser', password: '12345'});
    }
  },

  'fixtures/create_categories': function() {
    if (Categories.find().count() === 0) {
      var categories = [
        {name: "General"},
        {name: "Places"},
        {name: "Jobs"},
        {name: "Home"},
        {name: "Hangouts"}
      ];
      _.each(categories, function (category) {
        Categories.insert({
          name: category.name
        });
      });    
    }
  },

  'fixtures/create_thread': function() {
    if (Meteor.users.find({username: 'MockUser'}).count() === 0) {
      Accounts.createUser({username: 'MockUser', password: '12345'});
    }
    if (Categories.find().count() === 0) {
      var categories = [
        {name: "General"},
        {name: "Places"},
        {name: "Jobs"},
        {name: "Home"},
        {name: "Hangouts"}
      ];
      _.each(categories, function (category) {
        Categories.insert({
          name: category.name
        });
      });    
    };
    const user = Meteor.users.findOne({username: 'MockUser'});
    const category = Categories.findOne({name: "General"});
    var params = {
      category: category._id,
      user: user,
      comments: [],
      createdAt: moment.utc().format(),
      updatedAt: moment.utc().format(),
      title: 'Mock',
      description: 'Mock text',
      tags: ['hi', 'there'],
    };
    Threads.insert(params);
  }
})
