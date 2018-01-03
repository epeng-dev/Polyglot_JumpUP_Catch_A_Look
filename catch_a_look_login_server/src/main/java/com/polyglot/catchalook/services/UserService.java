package com.polyglot.catchalook.services;

import com.polyglot.catchalook.daos.UserDao;
import com.polyglot.catchalook.exceptions.UserNotFoundException;
import com.polyglot.catchalook.vos.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service("userService")
public class UserService {
    @Autowired
    private UserDao userDao;

    public int signIn(String id, String pw) throws UserNotFoundException{
        try {
            int userKey = this.userDao.getUserPrimary(id, pw);
            return userKey;
        }
        catch (IndexOutOfBoundsException e){
            throw new UserNotFoundException(e);
        }
    }

    public void signUp(String id, String pw, String nickname, String email){
        this.userDao.addUser(id, pw, nickname, email);
    }

    public void signOut(User user){

    }

    public User getUserinfo(int userKey) throws UserNotFoundException{
        try {
            return this.userDao.getUser(userKey);
        }
        catch (IndexOutOfBoundsException e){
            throw new UserNotFoundException(e);
        }
    }
}
