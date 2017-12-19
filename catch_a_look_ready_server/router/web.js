module.exports = function(app, connection){
    app.post('/api/roomlist', function(req, res){
        res.send(roomList);
    });
    
    app.get('/play', function(req, res){
        console.log('roomId');
    
        if(req.query.roomId != null) {
            console.log('aa:', req.query.roomId);
            res.redirect('a.html');
        } else {
            res.redirect('/login');
        }
    });
    
}