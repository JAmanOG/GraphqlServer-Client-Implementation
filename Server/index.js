import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4'
import axios from 'axios';

async function StartServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs:`
    type User {
        id: ID!
        name: String!
        username: String!
        email: String!
        address: String!
        phone: String!
        website: String!
        company: String!
    }
    type todos {
        id: ID!
        user: User
        title: String!
        completed: Boolean!
        }

    type Query {
        gettodos: [todos]
        getuser: [User]
        getuserbyid(id: ID!): User
    }
    `, 
    resolvers: {
        todos: {
            user: async (parent) => {
                try {
                    const user = await axios.get(`https://jsonplaceholder.typicode.com/users/${parent.userId}`);
                    return user.data;
                } catch (error) {
                    console.error('Error fetching user:', error);
                    throw new Error('User not found');
                }
            }
        },
        Query: {
            gettodos: async () => {
                try {
                    const todos = await axios.get('https://jsonplaceholder.typicode.com/todos');
                    return todos.data;
                } catch (error) {
                    console.error('Error fetching todos:', error);
                    throw new Error('Failed to fetch todos');
                }
            },
            getuser: async () => {
                try {
                    const users = await axios.get('https://jsonplaceholder.typicode.com/users');
                    return users.data;
                } catch (error) {
                    console.error('Error fetching users:', error);
                    throw new Error('Failed to fetch users');
                }
            },
            getuserbyid: async (_, { id }) => {
                try {
                    const user = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
                    return user.data;
                } catch (error) {
                    console.error('Error fetching user by ID:', error);
                    throw new Error('User not found');
                }
            }
        }
    }
    
  });

    await server.start();
  app.use('/graphql',expressMiddleware(server));

  app.listen(4000, () => {
    console.log('Server is running on port 4000');
  });
}

StartServer();