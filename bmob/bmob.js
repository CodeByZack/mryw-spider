var Bmob = require('hydrogen-js-sdk');
const BMOB_ID = "818f8d7565f7588990922e937dd3e7c8";
const BMOB_APPKEY = "baeecb59d59023ea9a71db006def599a";

//初始化BMOB
Bmob.initialize(BMOB_ID,BMOB_APPKEY);

let BmobInstance = {};

BmobInstance.instance = Bmob;

BmobInstance.login = function(username,password){
    return Bmob.User.login(username,password);
}

BmobInstance.randomArticle = function(){
    return BmobInstance.countArticles()
    .then(res=>{
        let Rand = Math.random();
        let num = Math.floor(Rand * res); //舍去
        const query = Bmob.Query("Articles");
        query.skip(num);
        query.limit(1);
        return query.find();
    });
}


BmobInstance.randomBg = function(){
    return BmobInstance.countImgs()
    .then(res=>{
        let Rand = Math.random();
        let num = Math.floor(Rand * res); //舍去
        const query = Bmob.Query("Imgs");
        query.skip(num);
        query.limit(1);
        return query.find();
    });
}

BmobInstance.queryArticleToDay = function(){
    const query = Bmob.Query("Articles");
    query.order("-updatedAt");
    query.limit(1);
    return query.find();
}

BmobInstance.getComments = function(objectId){
    const query = Bmob.Query("comments");
    query.equalTo("articleId", "==", objectId);
    return query.find();
}

BmobInstance.addComments = function(comment){
    const query = Bmob.Query("comments");
    query.set("content",comment.content);
    const pointer = Bmob.Pointer('Articles');
    const poiID = pointer.set(comment.objectId);
    query.set("articleId",poiID);
    return query.save();
}

BmobInstance.queryArticleByPage = function(page){
    const query = Bmob.Query("Articles");
    query.order("-updatedAt");
    query.limit(10);
    query.skip(10*(page-1));
    return query.find();
}
BmobInstance.countArticles = function(){
    const query = Bmob.Query('Articles');
    return query.count();
}
BmobInstance.countImgs = function(){
    const query = Bmob.Query('Imgs');
    return query.count();
}

BmobInstance.addArticle = function(article){
    const query = Bmob.Query('Articles');
    query.set("title",article.title);
    query.set("img","");
    query.set("author",article.author);
    query.set("content",article.content);
    return query.save();
}
BmobInstance.changeArticle = function(objectId,article){
    const query = Bmob.Query('Articles');
    query.set('id', objectId) //需要修改的objectId
    query.set("title",article.title);
    query.set("img",article.img_url);
    query.set("author",article.author);
    query.set("content",article.content);
    return query.save();
}

BmobInstance.delArticle = function(objectId){
    const query = Bmob.Query('Articles');
    return query.destroy(objectId);
}

BmobInstance.saveFile = function(files){
    let file;
    for(let item of files){
        file = Bmob.File(item.name, item);
    }
    return file.save();
}

BmobInstance.queryVoiceByPage = function(page){
    const query = Bmob.Query("Voices");
    query.order("-updatedAt");
    query.limit(9);
    query.skip(9*(page-1));
    return query.find();
}
BmobInstance.countVoices = function(){
    const query = Bmob.Query('Voices');
    return query.count();
}
module.exports = BmobInstance;