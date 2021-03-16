# RFC

### query

```graphql
query Get {
	userProfile(id: "1") {
		name
		city
	}
}
query GetItems($id: String!, $appid: String) {
	userProfile(id: $id, appid: $appid) {
		name
		city
	}
}
```

### query variables

```json
{
	"id": "1",
	"appid": "1"
}
```

```graphql
mutation MyMutation($input: CreateMyModelTypeInput = {title: ""}) {
	createMyModelType(input: $input) {
		id
	}
}
```
