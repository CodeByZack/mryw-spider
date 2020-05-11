// 导入koa，和koa 1.x不同，在koa2中，我们导入的是一个class，因此用大写的Koa表示:
const Koa = require('koa');
const router = require('koa-router')();
const bodyParser = require('koa-bodyparser');
const { bmobLogger, accessLogger } = require('./log');
const Bmob = require('./bmob/bmob');
// 创建一个Koa对象表示web app本身:
const app = new Koa();
app.use(bodyParser());


const praseDoc = (doc)=>{
    let { title, body } = doc;
    //处理标题
    title = title.slice(title.indexOf("/")+1,title.length);
    //处理作者
    const author = body.slice(0,body.indexOf("<br />"));
    //处理内容
    const content = body.slice(body.indexOf("<br />"),body.length).replace(/<br \/>/g,"\n");
    
    return {title,content,author}
};

router.post('/notify', async (ctx, next) => {

    const doc = ctx.request.body.data;
    //让语雀webhook通知返回
    ctx.response.body = "";
    
    const article = praseDoc(doc);
    //添加到bmob数据库
    try {
        const res = await Bmob.addArticle(article);
        bmobLogger.info(`save ${article.title}/${article.author} to objectId:${res.objectId}`);
    } catch (error) {
        bmobLogger.error(JSON.stringify(error));
    }
});

app.use(accessLogger());

// add router middleware:
app.use(router.routes());
// 在端口3000监听:
app.listen(3000);
console.log('app started at port 3000...');