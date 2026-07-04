package xyz.abcganada.foryou;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ForyouApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForyouApplication.class, args);
    }

}
