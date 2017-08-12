package com.oath.services;

import com.oath.models.LinkData;
import com.oath.models.MicroServicesGraphModel;
import com.oath.models.NodeData;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class MicroServicesManager {
    public MicroServicesGraphModel getMicroServicesGraph() {
        Random random = new Random();

        List<NodeData> nodes = Arrays.asList(
                new NodeData(0, "120 120", "Initial" + random.nextInt(100) ),
                new NodeData(1, "330 120", "First down" + random.nextInt(100)),
                new NodeData(2, "226 376", "First up"  + random.nextInt(100)),
                new NodeData(3, "60 276", "Second down"  + random.nextInt(100)),
                new NodeData(4, "226 226", "Wait" + random.nextInt(100))
        );

        List<LinkData> links = Arrays.asList(
                new LinkData(0, 0, "up or timer", -20),
                new LinkData(0, 1, "down", 20),
                new LinkData(1, 0, "up (moved)\nPOST", 20),
                new LinkData(1, 1, "down", -20),
                new LinkData(1, 2, "up (no move)"),
                new LinkData(1, 4, "timer"),
                new LinkData(2, 0, "timer\nPOST"),
                new LinkData(2, 3, "down" ),
                new LinkData(3, 0, "up\nPOST\n(dblclick\nif no move)"),
                new LinkData(3, 3, "down or timer", 20),
                new LinkData(4, 0, "up\nPOST"),
                new LinkData(4, 4, "down")
                );
        return new MicroServicesGraphModel("id", nodes, links);
    }
}
