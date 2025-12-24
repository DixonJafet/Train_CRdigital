package org.ticketApi;


import org.springframework.stereotype.Component;
import org.springframework.core.convert.converter.Converter;
@Component
public class RouteConverter implements Converter<String, Route> {

    @Override
    public Route convert(String source) {
        return Route.fromValue(source);
    }
}