
let Service = require('node-windows').Service;

let svc = new Service({
    name: 'node_test',    //��������
    description: '�걨��Ŀ������', //����
    script: 'D:/xh-server', //nodejs��ĿҪ�������ļ�·����
    wait: '1', //
    grow: '0.25', //�����ȴ�ʱ��ɳ�ֵ�������һ��1�룬�ڶ���1.25
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
