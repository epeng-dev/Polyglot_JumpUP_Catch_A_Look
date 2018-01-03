package com.polyglot.catchalook.daos.mariadbDao;

import com.polyglot.catchalook.daos.UserDao;
import com.polyglot.catchalook.vos.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

@Repository
public class UserDaoMaria implements UserDao{
    @Autowired
    private JdbcTemplate jdbcTemplate;


    @Override
    public void addUser(String id, String pw, String nickname, String email) {
        this.jdbcTemplate.update("INSERT INTO `USER`(`user_id`, `user_pw`, `user_nickname`, `user_email`) VALUES (?, ?, ?, ?)", id, pw, nickname, email);
    }

    @Override
    public void deleteUser(int userKey) {

    }

    @Override
    public User getUser(int userKey) throws IndexOutOfBoundsException {
        return this.jdbcTemplate.query(
                (Connection conn) -> {
                    PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM `user` WHERE `user_key` = ?");
                    pstmt.setInt(1, userKey);
                    return pstmt;
                },
                (ResultSet rs, int rowNum) -> (new User(rs.getInt("user_key"), rs.getString("user_nickname"), rs.getInt("user_win")))
        ).get(0);
    }

    @Override
    public int getUserPrimary(String loginID, String loginPW) throws IndexOutOfBoundsException {
        return this.jdbcTemplate.query(
                (Connection conn) -> {
                    PreparedStatement pstmt = conn.prepareStatement("SELECT * FROM `user` WHERE `user_id` = ? AND `user_pw` = ?");
                    pstmt.setString(1, loginID);
                    pstmt.setString(2, loginPW);
                    return pstmt;
                },
                (ResultSet rs, int rowNum) -> (rs.getInt("user_key"))
        ).get(0);
    }
}
