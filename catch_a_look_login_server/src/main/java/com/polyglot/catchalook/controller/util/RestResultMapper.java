package com.polyglot.catchalook.controller.util;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

public class RestResultMapper {
    @JsonIgnore private static ObjectMapper objectMapper = new ObjectMapper();

    @JsonAutoDetect(fieldVisibility = JsonAutoDetect.Visibility.NON_PRIVATE)
    private static class RestResult{
        @JsonProperty("success") boolean resultType;
        @JsonProperty("reason") String reason;
        @JsonProperty("data") Object data;

        RestResult(boolean resultType){
            this.resultType = resultType;
        }

        RestResult(boolean resultType,  String description){
            this.resultType = resultType;
            this.reason = description;
        }

        RestResult(boolean resultType, Object data){
            this.resultType = resultType;
            this.data = data;
        }

        RestResult(boolean resultType, Object data, String description){
            this.resultType = resultType;
            this.data = data;
            this.reason = description;
        }
    }

    public static String get200Result(boolean resultType) throws JsonProcessingException{
        return objectMapper.writeValueAsString(new RestResult(resultType));
    }

    public static String get200Result(boolean resultType, Object data) throws JsonProcessingException{
        return objectMapper.writeValueAsString(new RestResult(resultType, data));
    }

    public static String get200Result(boolean resultType, String description) throws JsonProcessingException{
        return objectMapper.writeValueAsString(new RestResult(resultType, description));
    }

    public static String get200Result(boolean resultType, Object data, String description) throws JsonProcessingException{
        return objectMapper.writeValueAsString(new RestResult(resultType, data, description));
    }
}
