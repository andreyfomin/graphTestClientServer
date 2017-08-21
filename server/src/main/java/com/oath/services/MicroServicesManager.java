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
                new NodeData("a", "Initial" + random.nextInt(100) ),
                new NodeData("b", "First down" + random.nextInt(100)),
                new NodeData("c", "First up"  + random.nextInt(100)),
                new NodeData("d", "Second down"  + random.nextInt(100)),
                new NodeData("e", "Wait" + random.nextInt(100))
        );

        List<LinkData> links = Arrays.asList(
                new LinkData("a", "b", "down", "red"),
                new LinkData("b", "a", "up (moved)\nPOST", "green"),
                new LinkData("a", "c", "up (no move)"),
                new LinkData("b", "e", "timer"),
                new LinkData("c", "a", "timer\nPOST"),
                new LinkData("c", "d", "down" ),
                new LinkData("d", "a", "up\nPOST\n(dblclick\nif no move)"),
                new LinkData("e", "a", "up\nPOST")
                );
        return new MicroServicesGraphModel("id", nodes, links);
    }
}
