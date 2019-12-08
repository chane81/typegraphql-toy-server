# Query & Mutation

- query

  ```graphql
  query {
    findUser(lastName: "욱") {
      id
      firstName
      lastName
      email
      name
    }
  }

  query {
    me {
      id
      firstName
      lastName
      name
      email
    }
  }
  ```

- mutation

  ```graphql
  mutation {
    register(
      data: {
        firstName: "김"
        lastName: "창욱"
        email: "sangwook99@naver.com"
        password: "1111"
      }
    ) {
      id
      firstName
      lastName
      email
      name
    }
  }

  mutation {
    login(email: "sangwook99@naver.com", password: "1111") {
      id
      firstName
      lastName
      email
    }
  }
  ```
