package com.oath.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MicroServicesGraphModel {
    private String nodeKeyProperty;
    private List<NodeData> nodeDataArray;
    private List<LinkData> linkDataArray;
}
