package com.societyos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import com.societyos.common.security.JwtProperties;

@EnableConfigurationProperties(JwtProperties.class)
@SpringBootApplication
public class SocietyosApplication {

	public static void main(String[] args) {
		SpringApplication.run(SocietyosApplication.class, args);
	}

}
