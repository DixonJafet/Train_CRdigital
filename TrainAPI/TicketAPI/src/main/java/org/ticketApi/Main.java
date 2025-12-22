package org.ticketApi;
import com.mongodb.client.*;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.List;
//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or
// click the <icon src="AllIcons.Actions.Execute"/> icon in the gutter.

public class Main {
    public static void main(String[] args){
        SpringApplication.run(endPointsController.class,args);

/*
        Dotenv dotenv = Dotenv.load();

        String connectionString = dotenv.get("DB_CONNECTION_STRING");

        String selected_Route = "SanJose-Cartago";

        dbController controller = new dbController(connectionString);

        List<String> stationList = controller.getStationList(selected_Route);

        for(String station : stationList){
            System.out.println(station);
        }

*/
    }
}
