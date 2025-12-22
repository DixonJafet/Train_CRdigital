package org.ticketApi;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@SpringBootApplication

@RestController
@RequestMapping("/api")
public class endPointsController {


    private final DBController db;

    endPointsController(DBController dbController){


        this.db = dbController;
    }



    @GetMapping("/stations/{route}")
    public List<String> getStations(@PathVariable("route") Route route) {


        System.out.println(route.getValue());
        List<String> stationList = this.db.getStationList(route);

      //  List<String> stationList = new ArrayList<>();
        return  stationList;
    }

    @PostMapping("/stations/ticketInfo")
    public TicketInitialInfo getTickets(@RequestBody TicketBooking ticket) {

        System.out.println(ticket);

        TicketInitialInfo initialInfo = this.db.getPriceTime(   ticket.route(),
                                                        ticket.from(),
                                                        ticket.to());

        return initialInfo;
    }

}
