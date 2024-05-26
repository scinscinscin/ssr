import { graphql } from "../gql";

export const getUsersWithHobbies = graphql(/* GraphQL */ `
  query GetUsersWithHobbies($id: String!) {
    getUsers(id: $id) {
      id
      name
      hobbies {
        id
        name
        description
      }
    }
  }
`);
