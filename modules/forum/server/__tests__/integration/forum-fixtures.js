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

  'fixtures/create_user': function(username) {
    if (Meteor.users.find({username:username}).count() === 0) {
      Accounts.createUser({username: username, password: '12345'});
    }
  },

  'fixtures/remove_user': function(username) {
    const user = Meteor.users.findOne({username: username});
    if (user) {
      return Meteor.users.remove({_id: user._id});
    } else {
      return 1;
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
      comments: [
        {
          _id: '123',
          userId: '1',
          username: 'TestUser',
          avatar: undefined,
          text: 'Hello',
          createdAt: moment.utc().format(),
          likes: 0,
          likeIds: [],
          replies: [
            {
              _id: '321',
              userId: '1',
              username: 'TestUser',
              avatar: undefined,
              text: 'Yo',
              createdAt: moment.utc().format(),
              like: 0,
              likeIds: []
            }
          ]
        }
      ],
      createdAt: moment.utc().format(),
      updatedAt: moment.utc().format(),
      title: 'Mock',
      description: 'Mock text',
      tags: ['hi', 'there'],
    };
    return Threads.insert(params);
  },

  'fixtures/delete_thread': function() {
    const thread = Threads.findOne({title: 'Mock'});
    if (thread) {
      return Threads.remove({_id: thread._id});
    } else {
      return 1;
    }
  }
})
