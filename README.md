# graphQl-plugin

1. Clone this project from git.

2. Install dependencies using `npm i`

3. Run `godspeed dev`

4. You can access api using `curl` in `terminal` or you can use `postman`.

5. For curl - use below command to get response `curl -X POST -H "Content-Type: application/json" --data '{"query": "query { hello { id, name, email } }"}' http://localhost:3000/graphql`

6. You will get this response for api call. `{"data":{"hello":{"id":"1234567","name":"yaswanth","email":"yasswanth@godspeed"}}}`
