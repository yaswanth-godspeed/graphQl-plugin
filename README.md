# graphQl-plugin
clone this project from git.
install dependencies using `npm i`
run `godspeed dev`
you can access api using `curl` in `terminal` or you can use `postman`.
for curl - use below command to get response `curl -X POST -H "Content-Type: application/json" --data '{"query": "query { hello { id, name, email } }"}' http://localhost:3000/graphql`
you will get this response for api call. `{"data":{"hello":{"id":"1234567","name":"yaswanth","email":"yasswanth@godspeed"}}}`
