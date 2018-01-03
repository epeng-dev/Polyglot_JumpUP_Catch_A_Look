package com.polyglot.catchalook.vos;

import com.fasterxml.jackson.annotation.JsonProperty;

public class User {
    @JsonProperty private int userKey;
    @JsonProperty private String userNickname;
    @JsonProperty private int userWin;

    public User(int key, String name, int win){
        this.userKey = key;
        this.userNickname = name;
        this.userWin = win;
    }

    public int getUserKey(){
        return userKey;
    }

    public String getUserNickname() {
        return userNickname;
    }

    public int getUserWin() {
        return userWin;
    }
}
