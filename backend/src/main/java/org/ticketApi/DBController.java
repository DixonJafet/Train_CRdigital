package org.ticketApi;

import com.mongodb.MongoException;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PreDestroy;
import org.bson.Document;

import org.springframework.stereotype.Component;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Component
public class DBController implements AutoCloseable{

    private  final MongoClient mongoClient;
    private  final MongoCollection<Document> my_collection;

    DBController() {


        Dotenv dotenv = Dotenv.load();
        

        
        String connectionString = System.getenv("DB_CONNECTION_STRING");
     
        //String connectionString = dotenv.get("DB_CONNECTION_STRING");

       
        try {
            this.mongoClient = MongoClients.create(connectionString);
            MongoDatabase database = mongoClient.getDatabase("TrainTicketDB");
            this.my_collection = database.getCollection("Routes");
            System.out.print(connectionString);
            System.out.println("✅ Spring-managed DB Connection Pool initialized.");
        } catch (MongoException e) {
            throw new IllegalStateException("Failed to connect to MongoDB at startup.", e);
        }
    }



    public List<String> getStationList(Route selected_Route){


        System.out.println(this.my_collection.countDocuments());
            // List all databases to verify connection
            System.out.println(selected_Route.getValue());

            Document Route = my_collection.find(Filters.eq("name",selected_Route.getValue())).first();
            List<Document> stations = Route.getList("stations", Document.class);
            List<String> stationsName = new ArrayList<>();
            for (Document station : stations) {
                // Extract just the "name" field
                String stationName = station.getString("name");
                stationsName.add(stationName);
            }

            return stationsName;

    }

    private Integer getTime(List<Document> stations, String station_name){

        return Objects.requireNonNull(stations.stream()
                        .filter(i -> station_name.equals(i.getString("name")))
                        .findFirst()
                        .orElse(null))
                .getInteger("time");
    }

    public TicketInitialInfo getPriceTime(Route route, String from_name, String to_name){

        Document Route = this.my_collection.find(Filters.eq("name",route.getValue())).first();
        assert Route != null;
        List<Document> stations = Route.getList("stations", Document.class);

        Integer from_station_time  =  getTime(stations,from_name);
        Integer to_station_time =  getTime(stations,to_name);

        Integer base_price = Route.getInteger("base_price");
        Integer additional_price = Route.getInteger("additional_price");
        Integer travel_time = Math.abs(from_station_time-to_station_time);
        Integer final_price = travel_time*additional_price+base_price;


        String from_type = 0<(from_station_time-to_station_time)? "from_schedule":"from_reverse_schedule";
        List<String> schedules = Route.getList(from_type, String.class);
        List<String> Departure_time_list = new ArrayList<>();

        for (String schedule : schedules) {
            // Extract just the "name" field
            String newSchedule = addMinutes(schedule, from_station_time);
            Departure_time_list.add(newSchedule);
        }

        TicketInitialInfo response =  new TicketInitialInfo(Departure_time_list,travel_time,final_price);
        return response;
    }



    private String addMinutes(String baseTime, int extraMinutes) {
        LocalTime time = LocalTime.parse(baseTime);
        LocalTime newTime = time.plusMinutes(extraMinutes);
        return newTime.format(DateTimeFormatter.ofPattern("HH:mm"));
    }

    @PreDestroy
    @Override
    public void close() {
        if (this.mongoClient != null) {
            this.mongoClient.close();
            System.out.println("🔌 MongoClient connection pool closed by Spring.");
        }
    }

}



