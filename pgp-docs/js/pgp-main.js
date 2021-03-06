/**
* (c) 2008-2009 Development Lab
* PostgreSQL Stored Procedure Generator, Steve L. Nyemba
*
* Dependencies:
*	jxframework 0.7+
*/
var pgp={
	menu:{
		cache:null,
		init:function(){
			var url = 'xml/menu.xml' ;
			//-------------- Inner function definition
			var oInnerFn = function(xmlhttp){
				var xml  = jx.xmlparser.parse(xmlhttp.responseXML) ;
				xml = xml['site.menu'] ;
				
				var ids = xml['ids'] ;
				var link = new Array();
				var value="";
				
				pgp.menu.cache = new Array() ;
				pgp.menu.cache['jspx.menu'] = new Array();
				for (var i=0; i < ids.length; i++){
					value = xml['map'][ids[i]] ;
					link.push('<li type="square">') ;
					link.push('<a href="javascript:') ;
					link.push(value) ;
					link.push('">');
					link.push(ids[i]) ;
					
					link.push("</a>") ;
					pgp.menu.cache['jspx.menu'].push(link.join('')) ;
					if(i==0){
						pgp.menu.cache['jspx.menu.action'] = value;
					}
					link.length = 0;
				}
				pgp.menu.render() ;
			}
			//-------------- end of inner function definition
			if(pgp.menu.cache == null){
				jx.ajax.run(url,oInnerFn,'GET') ;
			}else{
				pgp.menu.render() ;
			}
		},//-- end pgp.menu.init()
		/**
		* This function will render the site menu
		* pre : pgp.menu.cache != null 
		* post: none
		*/
		render:function(){
			var target = 'jspx.menu'
			jx.edoc.set(pgp.menu.cache['jspx.menu'].join(' '),target) ;
			eval(pgp.menu.cache['jspx.menu.action']) ;
			
		}//-- end pgp.menu.render()
		
	},//-- end pgp.menu
	jspx:{
		read:function(url){
			var oInnerFn = function(xmlhttp){
				var content = new Array();
				if(url.match(".txt")){
					content.push('<pre>');
					content.push(xmlhttp.responseText) ;
					content.push('</pre>');
				}else{
					content.push(xmlhttp.responseText) ;
				}
				
				jx.edoc.set(content.join(''),'jspx.out') ;
			}
			jx.ajax.run(url,oInnerFn,'GET') ;
				
		},//-- end pgp.jspx.out(text)
		/**
		* Running a function
		*/
		run:function(cmd){
			eval(cmd) ;
			//-------- defining patterns for both url and fn
		}//-- end pgp.jspx.run(cmd) ;
	},//-- end pgp.jspx
	utils:{
		generate:function(owner,schema){
			var pattern = "^[aA-zZ]+$";
			if(owner.match(pattern) && schema.match(pattern)){
				//------------ Inner function
				var oInnerFn = function(xmlhttp){
					var _owner = "<OWNER>";
					var _schema= "<SCHEMA>"
					var text = xmlhttp.responseText ;
					//-------- replacing owner in place holder
					var regex = new RegExp(_owner,"g") ;
					text = text.replace(regex,owner) ;
					//-------- replacing schema in place holder
					regex = new RegExp(_schema,"g") ;
					text = text.replace(regex,schema) ;
					jx.edoc.show("pgp.out");
					jx.edoc.set(text,"pgp.out") ;
					jx.edoc.set("<font color=blue>stored proc generated for "+owner+"</font>","pgp.status") ;
					
				}
				//------------ end of inner function
				jx.ajax.run('template/Pg-crud-Generator.txt',oInnerFn,'GET') ;
				
			}else{
				jx.edoc.set("<font color=red>All input fields are required","pgp.status");
				jx.edoc.set("","pgp.out") ;
				jx.edoc.hide("pgp.out") ;
			}
		},//-- end pgp.utils.generate(owner,schema)
		init:function(){
			var owner = document.getElementById('owner').value ;
			var schema = document.getElementById('schema').value;
			pgp.utils.generate(owner,schema) ;
			
		}
	}//pgp.utils
	
}