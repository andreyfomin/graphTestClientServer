package com.oath.controllers;

import com.oath.models.MicroServicesGraphModel;
import com.oath.services.MicroServicesManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class MicroServicesMessageController {
    @Autowired
    MicroServicesManager microServicesManager;

    @MessageMapping("/microservermessage")
    @SendTo("/topic/getmsgraph")
    MicroServicesGraphModel getMicroServiceGraphObject() throws InterruptedException {
        Thread.sleep(1000); // simulated delay
        return microServicesManager.getMicroServicesGraph();
    }
}
