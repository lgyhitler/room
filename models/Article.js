var mysql = require('node-mysql-sexy-query-master');
var config = require('../config').config;
var fs = require("fs");
	mysql.createClient(config.db_opt);
/**
 * 图文内容实体
 */
function Article(art){
	this.title = art.title;
	this.description = art.description;
	this.picUrl = art.picUrl;
	this.url = art.url;
}
module.exports = Article;

/**
 * 查询
 * @condition 条件参数
 */
Article.getArticles = function(condition, callback){
	mysql.use('requirement_info').where('image != ?' , 'NULL')
					.where('worklocation like ?','%'+condition.area+'%')
					.select('*')
					.get(10, function(rows){
						var arr = new Array();
						for(var i=0 ;i<rows.length ;i++){
							arr.push(new Article({title:rows[i].TITLE, picUrl:rows[i].IMAGE, url:rows[i].UUID}));
						}
						mysql.close();//用完后立即关闭，防止8小时过后链接失效无法重新链接
						callback(arr);
					});
}
/**
 * 详细内容链接
 * @uid uuid
 */
Article.getArticleDetail = function(uid, callback){
	mysql.use('requirement_info').where('uuid = ?', uid)
								.get(function(row){
									mysql.close();
									callback(row);
								});
}
/**
 * 获得3个招工信息
 * @num 数量
 */
Article.get3Articles = function (num, callback){
	mysql.use('requirement_info').where('image != ?', 'NULL')
	.select('*')
	.get(20, function(rows){
		mysql.close();
		var arr = new Array();
		for(var i=0;i<rows.length;i++){
			if(arr.length < num){
				if(Math.random() > 0.5){
					arr.push(new Article({title:rows[i].TITLE, picUrl:rows[i].IMAGE, url:rows[i].UUID}));
				}
			}
		}
		callback(arr);
	});
}

