package org.ticketApi;


import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum Route {
    SANJOSE_CARTAGO("SanJose-Cartago"),
    SANJOSE_BELEN("SanJose-Belén"),
    SANJOSE_ALAJUELA("SanJose-Alajuela");

    private final String value;

    Route(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @JsonCreator
    public static Route fromValue(String value) {
        for (Route r : Route.values()) {
            if (r.value.equalsIgnoreCase(value)) {
                return r;
            }
        }
        throw new IllegalArgumentException("Invalid route: " + value);
    }
}






