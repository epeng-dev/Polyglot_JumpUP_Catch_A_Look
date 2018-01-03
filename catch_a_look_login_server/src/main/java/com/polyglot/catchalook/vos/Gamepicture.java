package com.polyglot.catchalook.vos;

public class Gamepicture {
    private int userNum;
    private String userName;
    private String userPic;

    public Gamepicture(int num, String name, String picture){
        this.userNum = num;
        this.userName = name;
        this.userPic = picture;
    }

    public int getUserNum() {
        return userNum;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserPic() {
        return userPic;
    }

}
