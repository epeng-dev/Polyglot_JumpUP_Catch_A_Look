package com.polyglot.catchalook.daos;

import com.polyglot.catchalook.vos.User;

public interface UserDao {
    void addUser(String id, String pw, String nickname, String email);

    void deleteUser(int userKey);

    User getUser(int userKey) throws IndexOutOfBoundsException;

    int getUserPrimary(String loginID, String loginPW) throws IndexOutOfBoundsException;
}
