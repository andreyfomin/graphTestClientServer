package com.oath.controllers;

import com.oath.models.MicroServicesGraphModel;
import com.oath.services.MicroServicesManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/microservices")
public class MicroServicesController {
    @Autowired
    MicroServicesManager microServicesManager;

    @RequestMapping(value = "/get/graph", method = RequestMethod.GET)
    public
    @ResponseBody
    MicroServicesGraphModel getMicroServiceGraphObject() {
        return microServicesManager.getMicroServicesGraph();
    }
}
