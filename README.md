# Pizza Order Demo

In this quickstart, you will create a pizza order microservices which contians the following modules:
* Pizza Order Web Application (NodeJS)
* Pizza Order Processing Service (C#)

## PizzaWeb

Initialize the project:

Run the following command under the dir `pizza-microservice-containers/PizzaWeb`

```
npm install
```

Start the service:

Run the following command under the dir `pizza-microservice-containers/PizzaWeb`
```
dapr run --dapr-http-port 3500 --app-id myapp --components-path ../components/ --app-port 3001 -- npm run debug
```

## PizzaOrderProcessor

Initialize the project:

Run the following command under the dir `pizza-microservice-containers/PizzaOrderProcessor`

```
dotnet restore
dotnet build
```

Start the service:

Run the following command under the dir `pizza-microservice-containers/PizzaOrderProcessor`
```
dapr run --app-id order-processor-http --components-path ../components/ --app-port 3001 -- dotnet run --project .
```