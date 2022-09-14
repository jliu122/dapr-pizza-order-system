using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

if (app.Environment.IsDevelopment()) {app.UseDeveloperExceptionPage();}

// Register Dapr pub/sub subscriptions
app.MapGet("/dapr/subscribe", () => {
    var sub = new DaprSubscription(PubsubName: "servicebus-pubsub", Topic: "order", Route: "order");
    Console.WriteLine("Dapr pub/sub is subscribed to: " + sub);
    return Results.Json(new DaprSubscription[]{sub});
});

// Dapr subscription in /dapr/subscribe sets up this route
app.MapPost("/order", (DaprData<string> requestData) => {
    Console.WriteLine("Subscriber received : " + requestData.Data);
    var jsonString = requestData.Data;
    var order = JsonSerializer.Deserialize<Order>(jsonString)!;
    Console.WriteLine("order id is: " + order.OrderId);
    foreach (var pizza in order.Cart) {
        Console.WriteLine("pizza name: " + pizza.Name);
        Console.WriteLine("pizza count: " + pizza.Count);
        Console.WriteLine("pizza price: " + pizza.Price);
    }
    return Results.Ok(requestData.Data);
});

await app.RunAsync();

public record DaprData<T> ([property: JsonPropertyName("data")] T Data);

public record Pizza(
    [property: JsonPropertyName("name")] string Name,
    [property: JsonPropertyName("price")] float Price,
    [property: JsonPropertyName("count")] int Count
);
public record Order(
    [property: JsonPropertyName("orderId")] int OrderId,
    [property: JsonPropertyName("cart")] List<Pizza> Cart
);

public record DaprSubscription(
    [property: JsonPropertyName("pubsubname")] string PubsubName, 
    [property: JsonPropertyName("topic")] string Topic, 
    [property: JsonPropertyName("route")] string Route);