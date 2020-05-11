const path = require('path');
const log4js = require('koa-log4');
 
log4js.configure({
 appenders: {
  access: {
   type: 'dateFile',
   pattern: '-yyyy-MM-dd.log', //生成文件的规则
   filename: path.join('back-end/logs/', 'access.log') //生成文件名
  },
  bmob: {
   type: 'dateFile',
   pattern: '-yyyy-MM-dd.log',
   filename: path.join('back-end/logs/', 'bmob.log')
  },
  out: {
   type: 'console'
  }
 },
 categories: {
  default: { appenders: [ 'out' ], level: 'info' },
  access: { appenders: [ 'access' ], level: 'info' },
  bmob: { appenders: [ 'bmob' ], level: 'info'}
 }
});
 
exports.accessLogger = () => log4js.koaLogger(log4js.getLogger('access')); //记录所有访问级别的日志
exports.bmobLogger = log4js.getLogger('bmob'); //记录所有应用级别的日志