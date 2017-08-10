package com.oath.models;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LinkData {
    private int from;
    private int to;
    private String text;
    private int curviness;
}
