module.exports = function(app, connection){
  app.get('/', function(req, res) {
    if(req.query.roomid != null){
      res.send('id: ' + req.query.roomid);
    }
    else{
      res.redirect('/login');
    }
  });

  app.get('/login', function(req, res){
    const sess = req.session;
    if(sess.user == null)
      res.render('index.html');
    else {
      res.redirect('/game');
    }
  });
  
  app.post('/login', function(req, res){
    sess = req.session;
    var id = req.body.id;
    var pw = req.body.pw;
    var result = {};
    connection.query('SELECT user_id, user_pw, user_nickname from user where user_id= ?', id, function(err, rows, fields){
      if(err){
        console.log(err);
      }
      else if (rows[0] == null) {
        result["reason"] = "ID를 찾을 수 없습니다.";
        res.json(result);
      }
      else{
        if (pw != rows[0].LOGIN_PW) {
          result["reason"] = "PW가 틀렸습니다.";
          res.json(result);
        }
        else{
          req.session.user = rows[0];
          res.redirect('/');
        }
      }
    });
  });

  app.post('/signup', function(req, res){
    var id = req.body.id_join;
    var pw = req.body.pw_join;
    var pw_repeat = req.body.pw_repeat_join;
    var email = req.body.email_join;
    var name = req.body.nick_join;
    console.log(name);
    var result = {};
    if(pw != pw_repeat){
      result["reason"] = "비밀번호와 비밀번호 확인 란이 다릅니다.";
      res.json(error);
    }

    var user = {"user_id": id,
                "user_pw": pw,
                "user_nickname": name,
                "user_email": email};
    
    connection.query('SELECT user_id, user_pw, user_nickname from user where user_id= ?', id, function(err, rows, fields){
      if(err){
        console.log(err);
      }
      else if(rows[0] != null){
        result["reason"] = "동일한 id의 아이디가 있습니다."
        res.json(result);
      }
      else{
        connection.query('insert into User set ?', user, function(err, result){
          if(err){
            console.error(err);
            result["reason"] = "서버 내부에 오류입니다. 불편을 드려 죄송합니다.";
            res.json(error);
          }
          else{
            result["success"] = true;
            res.json(result);
          }
        });
      }
    });
  });
  
  app.get('/game', function(req, res){
    const sess = req.session;
    if(sess.user == null)
      res.redirect('/');
    else {
      res.render('IDE.html');
    }
  });
  
  app.get('/logout', function(req, res){
    delete req.session.user;
    res.redirect('/');
  });
}
