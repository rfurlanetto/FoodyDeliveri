package com.delivery.rastreador;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class DeliveryTrackerApplication {
    public static void main(String[] args) {
        SpringApplication.run(DeliveryTrackerApplication.class, args);
    }
}
