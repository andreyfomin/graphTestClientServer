package com.oath.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Data
@AllArgsConstructor
@RequiredArgsConstructor
@NoArgsConstructor
public class LinkData {

    @NonNull
    private String from;

    @NonNull
    private String to;

    @NonNull
    private String text;

    private String color;

}
