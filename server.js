"use strict";
var express = require('express');
var express_graphql = require('express-graphql').graphqlHTTP;
var buildSchema = require('graphql').buildSchema;
// GraphQL schema
var schema = buildSchema("\n    type Query {\n        course(id: Int!): Course\n        courses(topic: String): [Course]\n    },\n    type Course {\n        id: Int\n        title: String\n        author: String\n        description: String\n        topic: String\n        url: String\n    }\n");
var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/',
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/',
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/',
    },
];
var getCourse = function (args) {
    var id = args.id;
    return coursesData.filter(function (course) {
        return course.id == id;
    })[0];
};
var getCourses = function (args) {
    if (args.topic) {
        var topic_1 = args.topic;
        return coursesData.filter(function (course) { return course.topic === topic_1; });
    }
    else {
        return coursesData;
    }
};
var root = {
    course: getCourse,
    courses: getCourses,
};
// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000, function () {
    return console.log('Express GraphQL Server Now Running On localhost:4000/graphql');
});
