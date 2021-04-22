const express = require('express');
const express_graphql = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

// _______________A marquer dans GraphiQl (j'suis sympa)

// ______________________________________________ Recherche un cours qui contient une string
// ______________QUERY
// query searchTitle($searchString: String!) {
//   searchTitle(search: $searchString) {
//     title
//     author
//     description
//     topic
//     url
//   }
// }

// ________________QUERY VARIABLES
// {
//   "searchString":""
// }

// ______________________________________________ Poste un cours
// ______________MUTATION
// mutation postCourse($title: String!, $author: String, $description: String, $topic: String, $url: String) {
//   postCourse(title: $title, author: $author, description: $description, topic:$topic, url:$url) {
//     title
//     author
//     description
//     topic
//     url
//   }
//   }

// ________________QUERY VARIABLES
// {
//   "title":"GrapQl pour les nuls",
//   "author":"Nico",
//   "description":"Apprends graphQL dans la douleur",
//   "topic":"Node.s",
//   "url":""
// }

// GraphQL schema

const schema = buildSchema(`
    type Query {
        course(id: Int!): Course
        courses(topic: String): [Course]
        searchTitle(search: String!): [Course]
    },
    type Mutation {
      updateCourseTopic(id: Int!, topic: String!): Course
      postCourse(title: String!, author: String, description: String, topic: String, url: String): [Course]

  }
    type Course {
        id: Int
        title: String
        author: String
        description: String
        topic: String
        url: String
    }
`);

type Course = {
  id: number;
  title: string;
  author: string;
  description: string;
  topic: string;
  url: string;
  search: string;
};

const coursesData = [
  {
    id: 1,
    title: 'The Complete Node.js Developer Course',
    author: 'Andrew Mead, Rob Percival',
    description:
      'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
    topic: 'Node.js',
    url: 'https://codingthesmartway.com/courses/nodejs/',
  },
  {
    id: 2,
    title: 'Node.js, Express & MongoDB Dev to Deployment',
    author: 'Brad Traversy',
    description:
      'Learn by example building & deploying real-world Node.js applications from absolute scratch',
    topic: 'Node.js',
    url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/',
  },
  {
    id: 3,
    title: 'JavaScript: Understanding The Weird Parts',
    author: 'Anthony Alicea',
    description:
      'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
    topic: 'JavaScript',
    url: 'https://codingthesmartway.com/courses/understand-javascript/',
  },
];

const getCoursesByString = function (args: Course) {
  const stringToSearch = args.search;
  return coursesData.filter((course) => {
    return course.title.includes(stringToSearch);
  });
};

const getCourse = function (args: Course) {
  const id = args.id;
  return coursesData.filter((course) => {
    return course.id == id;
  })[0];
};

const getCourses = function (args: Course) {
  if (args.topic) {
    const topic = args.topic;
    return coursesData.filter((course) => course.topic === topic);
  } else {
    return coursesData;
  }
};

const updateCourseTopic = function ({ id, topic }: Course) {
  coursesData.map((course) => {
    if (course.id === id) {
      course.topic = topic;
      return course;
    }
  });
  return coursesData.filter((course) => course.id === id)[0];
};

const postCourse = function ({
  title,
  author,
  description,
  topic,
  url,
}: Course) {
  const newCourse = {
    id: coursesData.length,
    title: title,
    author: author,
    description: description,
    topic: topic,
    url: url,
  };
  coursesData.push(newCourse);
  return coursesData;
};

const root = {
  course: getCourse,
  courses: getCourses,
  searchTitle: getCoursesByString,
  updateCourseTopic: updateCourseTopic,
  postCourse: postCourse,
};

// Create an express server and a GraphQL endpoint
const app = express();
app.use(
  '/graphql',
  express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
app.listen(4000, () =>
  console.log('Express GraphQL Server Now Running On localhost:4000/graphql')
);
