package com.oath.services;

import com.oath.models.LinkData;
import com.oath.models.MicroServicesGraphModel;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;

@Service
public class MicroServicesManager {
    public MicroServicesGraphModel getMicroServicesGraph() {
        List<LinkData> links = Arrays.asList(
                new LinkData(0, 0, "up or timer", -20),
                new LinkData(0, 0, "up or timer", -20));
        MicroServicesGraphModel model = new MicroServicesGraphModel();
        return model;
    }
}
