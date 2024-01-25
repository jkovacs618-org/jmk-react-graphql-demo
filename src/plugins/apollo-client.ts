import { ApolloClient, ApolloLink, createHttpLink, InMemoryCache  } from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import { onError } from "@apollo/client/link/error";
import { VITE_GRAPHQL_BASE_URL, AUTH_TOKEN } from '../setup';
// import { split } from '@apollo/client';
// import { WebSocketLink } from '@apollo/client/link/ws';
// import { getMainDefinition } from '@apollo/client/utilities';

const errorLink = onError(
    ({ operation, graphQLErrors, networkError }) => {
      console.log('Apollo Error: operation:', operation.operationName);

      if (networkError) {
        console.log("GraphQL server: A network error has been found: ", networkError);
      } else {
        console.log("GraphQL server: There has been an error: ", graphQLErrors);
      }
    }
  );

const httpLink = createHttpLink({
    uri: `${VITE_GRAPHQL_BASE_URL}`
});

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem(AUTH_TOKEN);
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
});

/*
const wsLink = new WebSocketLink({
    uri: `ws://localhost:4000/graphql`,
    options: {
        reconnect: true,
        connectionParams: {
            authToken: localStorage.getItem(AUTH_TOKEN)
        }
    }
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return (
            kind === 'OperationDefinition' && operation === 'subscription'
        );
    },
    wsLink,
    authLink.concat(httpLink)
);
}
*/

// Temporary use of ApolloLinks without WebSocketLink for subscriptions:
const link = ApolloLink.from([errorLink, authLink, httpLink]);

const client = new ApolloClient({
    // uri: `${VITE_GRAPHQL_BASE_URL}`,
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Event: {
          keyFields: ["externalId"],
        }
      }
    }),
    connectToDevTools: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      },
    },
});

export default client