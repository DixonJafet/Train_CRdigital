package org.ticketApi;
import org.springframework.boot.SpringApplication;



//TIP To <b>Run</b> code, press <shortcut actionId="Run"/> or


public class Main {
    public static void main(String[] args){
        SpringApplication.run(endPointsController.class,args);


/*


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
