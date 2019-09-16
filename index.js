const http = require('http');
const nUrl = require('url');
const config = require('./config');
const controller = require('./controller');

//redis
var redis   = require('redis');
var client  = redis.createClient('6379', '127.0.0.1');
client.on("error", function(error) {
   console.log(error);
});


//mysql
mysql = require('mysql');
var mysqlConn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'mengwp_2004',
  database : 'gusto'
});

mysqlConn.on("error",function(error){
   console.log(error);
});

//rabbitmq连接
var amqp = require("amqp");
var amqpConn = amqp.createConnection({url: "amqp:guest:guest@127.0.0.1:5672"});

//amqp监听消息进行消费
amqpConn.on('ready', function () {  
    amqpConnReady = true;
    amqpConn.queue('orderQueue', { durable: true, autoDelete: false }, function (queue) {  
        console.log('Queue ' + queue.name + ' is consuming!');  
        orderQueue = queue;
        queue.subscribe(function (message, header, deliveryInfo) {  
            if (message.data) {  
                var messageText = message.data.toString();  
                console.log(messageText);  
                var data = JSON.parse(messageText); 
            }  
        });  
    });  
});

//server
const route = require('./route').map(item => {
    console.log(`route ${item.method}:${item.path}`);

    let tuple = item.impl.split('.');
    item.impl = controller[tuple[0]][tuple[1]];
    return item;
});

const server = http.createServer((req, res) => {
    let method = req.method;
    let url = nUrl.parse(req.url);

    let matchRoute = route.find(item => {
        return item.method === method && item.path === url.pathname;
    });

    if (matchRoute) {
        matchRoute.impl(req, res);
        return;
    }

    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
});

server.listen(config.port, config.hostname, () => {
    console.log(`Server running at http://${config.hostname}:${config.port}/`);
});
