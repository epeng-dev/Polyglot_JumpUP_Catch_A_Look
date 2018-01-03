package com.polyglot.catchalook.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.polyglot.catchalook.controller.util.JsonParser;
import com.polyglot.catchalook.controller.util.RestResultMapper;
import com.polyglot.catchalook.exceptions.UserNotFoundException;
import com.polyglot.catchalook.services.UserService;
import com.polyglot.catchalook.vos.User;
import org.json.simple.JSONObject;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
public class RequestController {
    @Autowired
    private UserService userService;

    @RequestMapping(value = "/login", method = RequestMethod.POST)
    public Object logIn(@RequestParam("param") String param) throws JsonProcessingException{
        try{
            final JSONObject jsonParam = JsonParser.parseJsonObject(param);
            final JSONObject jsonParamData = (JSONObject)jsonParam.get("data");
            int userId= this.userService.signIn((String)jsonParamData.get("id"), (String)jsonParamData.get("pw"));
            User user = this.userService.getUserinfo(userId);
            return RestResultMapper.get200Result(true, user);
        }
        catch (UserNotFoundException e){
            return RestResultMapper.get200Result(false, "check your ID or PW");
        }
        catch (ParseException e){
            e.printStackTrace();
            return RestResultMapper.get200Result(false, "Can't Parse JSON");
        }
    }

    @RequestMapping(value = "/signUp", method = RequestMethod.POST)
    public Object signUp(@RequestParam("param") String param) throws JsonProcessingException{
        try {
            final JSONObject jsonParam = JsonParser.parseJsonObject(param);
            final JSONObject jsonParamData = (JSONObject)jsonParam.get("data");
            this.userService.signUp((String)jsonParamData.get("id"),
                    (String)jsonParamData.get("pw"),
                    (String)jsonParamData.get("nickname"),
                    (String)jsonParamData.get("email"));
            return RestResultMapper.get200Result(true);
        }
        catch (ParseException e){
            e.printStackTrace();
            return RestResultMapper.get200Result(false, "Can't Parse JSON");
        }
    }
}
