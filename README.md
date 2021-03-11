Investigate how to create APP SYNC AWS GraphQL API Create a GraphQL API revives object below as payload and stores object in Dynamo DB. Generate a random ID for this object and
store it with this ID as Partition Key in Dynamo DB.

{
    "recepientCriteria": {
        "upns": [
            "test@google.com",
            "store@yahoo.com"
        ]
    },
    "body": {
        "subject": "example subject",
        "text": "The word content with the notification details", },
        "resource": {
        "link": "https://test/test",
        "type": "internal"
    },
    "categoryCode": "internal_mobility"
}

Create an APP SYNC API that gets this object by Id from Database. Create an AWS SAM template to build and deploy this app to your AWS account Commit your code to GITHUB GITLAB
etc…… and share the link

Some hints:
You must have an AWS account To complete this task, you need to create an AWS APP SYNC API - with one QUERY and one MUTATION resolver and create Dynamo DB as a data source for
these resolvers. You can use API key as Default authorization mode in APP SYNC.

