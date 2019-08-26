
let Service = require('node-windows').Service;

let svc = new Service({
    name: 'node_test',    //服务名称
    description: '申报项目服务器', //描述
    script: 'D:/xh-server', //nodejs项目要启动的文件路径，
    wait: '1', //
    grow: '0.25', //重启等待时间成长值，比如第一次1秒，第二次1.25
    maxRestarts: '40',
});

svc.on('install', () => {
    svc.start();
    console.log('install complete.');
});
svc.on('uninstall', () => {
    console.log('uninstall complete.');
    console.log('The service exists:', svc.exists);
});
svc.on('alreadyinstalled', () => {
    console.log('This service is already installed.');
});
if (svc.exists) return svc.uninstall();
svc.install();
