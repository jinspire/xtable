(function($,w){
 	$.fn.xtable=function(config){
 	
 	//private member	
	var trHTML = config.trHTML;
	var baseURL = config.baseURL;
	var model = config.model;	
	var tdCfgs=config.tdCfgs;
	var xtable=this;
	// activeTR.id 代表两种状态 
	var activeTR = null;
	
	if(!this||!this.get(0)||this.get(0).tagName!=='TABLE') {
		alert('table is not exist!')
		return;
	}
	if(!baseURL) {
		alert('baseURL is not exist!');
		return;
	}
	
	
	//private method 
	var makeTREditable = function(editTR) {
		var editableTD = editTR.children(".edit_td").has('.editbox');
		editableTD.children(".text").hide();
		editableTD.children(".editbox").show();
		
		// show save btn & hide delete btn
		var operTD = editTR.children(".oper_td");
		operTD.find(".save_a").show();
		operTD.find(".delete_a").hide();
		operTD.find(".edit_a").hide();
	};
	
	var makeTRAddable=function(addTR){
		var addableTD=addTR.children("td").has(".editbox");
		addableTD.children(".text").hide();
		addableTD.children(".editbox").show();
		
		var operTD = addTR.children(".oper_td");
		operTD.find(".save_a").show();
		operTD.find(".delete_a").hide();
		operTD.find(".edit_a").hide();		
	};

	//校验数据并创建提交paramString
	var validateAndCreateParamsStr=function(editableTD){
		 var dataString = '';
		    if(!!model){
				for (attr in model)
					dataString=attr + '=' + model[attr] + '&';
		    }
		    		   
		    editableTD.each(function() {
		    	var editbox_val = $.trim($(this).children(".editbox:first").val());
		    	var edit_td_id = $(this).attr("id");
		    	
		    	var cfg=tdCfgs[edit_td_id];
		    	if(!!cfg&&!!cfg.validator){		    	
		    	
			    var v=null;
			    if(cfg.validator.constructor!==Array){
			    	v=[];
			    	v.push(cfg.validator);
			    }
			    else{
			    	v=cfg.validator;
			    }
			    //chain of responsibility validators			 
			    for(var i=0;i<v.length;i++){
			    		  var e=v[i];
			    		  if(!e.validate)continue;
			    		  if(!e.validate(editbox_val)){
			    			   alert(e.errorMsg);
			    			   dataString=null;
			    			   return false;
			    		   }
			    		}
		    	}
		    	// 验证通过之后才进行转码
		    	if(!!editbox_val){
		    	editbox_val = encodeURIComponent(editbox_val);
			    dataString += edit_td_id + "=" + editbox_val + "&";
		    	}
		    });
		    
		    return dataString;
	};
	
	var makeTRUneditable = function(editTR) {
		editTR.find(".text").show();
		editTR.find(".editbox").hide();
		
		// hide save btn & show delete btn
		var operTD = editTR.children(".oper_td");
		operTD.find(".save_a").hide();
		operTD.find(".edit_a").show();
		operTD.find(".delete_a").show();
	};

	//bind edit_td.click event
    var clickEditTR = function() {
    	if(!!activeTR) {
    		var tmpTRId = $(this).parent().attr("id");			
    		var trID = activeTR.attr("id");
    		if(tmpTRId == trID)
    			return;
    		if(trID != "0")
    			makeTRUneditable(activeTR);
    		else
    			activeTR.remove();
    		activeTR = null;
    	}
		activeTR = $(this).parent();
		makeTREditable(activeTR);
		
		//special operation	
		activeTR.children(".edit_td").each(function() {
		
			var id=$(this).attr('id');
			var t=tdCfgs[id];
        	var editUIType=null;
        	if(!!t) editUIType=t['type'];
	    	if(!editUIType)editUIType='input';
	    	
		
			if(editUIType==='date')
				$(this).children('.editbox').datepicker(t['cfg']);
		});
		
		// 若使用了 datepicker, 屏蔽 $(document).click()事件，由于只存在一个ui-datepicker-div，所以绑定一次是可以的
		$("#ui-datepicker-div").unbind();
		$("#ui-datepicker-div").click(function() {
			return false;
		});
		return false;
	};
	
	var addTR = function() {
		// 点击 增加按钮，如有处于编辑状态的行将之变为不可编辑
		if(!!activeTR) {
			var trID = activeTR.attr("id");
			if(trID != "0")
				makeTRUneditable(activeTR);
			else
				return false;
		}
		var firstTR = xtable.find('tbody tr:first');
		if(firstTR.length != 0)
			firstTR.before(trHTML);
		else			
			xtable.find('tbody').append(trHTML);
	
		var addTR =xtable.find('tbody tr:first');
		activeTR = addTR;
		addTR.click(function() {
			return false;
		});
		makeTRAddable(addTR); 
	    
	    var saveButton = addTR.find(".save_a");
	    var editTD = addTR.children(".edit_td");
	    var operTD = addTR.children(".oper_td");

	    //init UI component status.native ui like select,can init with html.
	    editTD.map(function() {
	    	var editbox = $(this).children(".editbox");
	    	var id = $(this).attr('id');
	    	
	    	var t=tdCfgs[id];
        	var editUIType=null;
        	if(!!t) editUIType=t['type'];
	    	if(!editUIType)editUIType='input';
	    		    	
	    	if(editUIType==='date'){	    		
	    		$(this).children('.editbox').datepicker(t['cfg']);
	    	}
	    	
	    	else if(editUIType==='select') {
	    		if(editbox.prop('tagName')!=='SELECT')return;
		    	var selectCfg = t['cfg'];
		    	if(!selectCfg)return;
		    	var uiModel=null;
		    	if(selectCfg.constructor== Function){
		    		selectCfg(editbox);
		    		return;
		    	}		    			    			    		    	
	    	} 	    		    		    
	    	
	 	});
	    
	 	// 若使用了 datepicker, 屏蔽 $(document).click()事件，由于只存在一个ui-datepicker-div，所以绑定一次是可以的
		$("#ui-datepicker-div").unbind();
		$("#ui-datepicker-div").click(function() {
			return false;
		});
			   
		saveButton.click(function() {
			saveTR();
			return false;
		});
	};
	
	var refreshEditedTD=function(editedTD,p){
	 	editedTD.map(function() {	           		
       		
            var editbox = $(this).children(".editbox:first");
            if(!editbox)return;
        	var id = $(this).attr('id');
        	
        	var t=tdCfgs[id];
        	var editUIType=null;
        	if(!!t) editUIType=t['type'];
	    	if(!editUIType)editUIType='input';
	    	
            var display_text = null;
            var value = null;
            try {
            	value = eval("p." + id);
            } catch(Exception) {
            	
            }
            //if(value!==false&&!value)return;
            if(value === null && value === undefined)
            	value = '';
            
            if(editUIType==='date'){
            			                				               
            		var dateFormat = $(editbox).datepicker("option", "dateFormat");
            		var tmpDate = new Date(value);
            		display_text = formatDateFun(tmpDate, dateFormat);	     	                	    
            	
            }
            else if(editbox.prop('tagName') === 'SELECT'){
           		display_text = editbox.children('option[value="' + value + '"]').text();
           	} 
            else {
           		display_text = value;
            }
			$(this).children(".text:first").html(display_text);
        });
	};
	
	var editTR = function(editTR) {
		var changedtr = editTR;
		var ID = changedtr.attr('id');
	    var editTD = changedtr.children(".edit_td");
	    var editableTD = editTD.has(".editbox[value!=undefined]");
	    
	    var dataString=validateAndCreateParamsStr(editableTD);
	    
		if(!dataString)
			return;
		$.ajax({
			type: 'PUT',
	        dataType : 'json', 
	        url: baseURL + ID,
	        data: dataString,
	        cache: false,
	        statusCode: {
				400: function(error) {
					var errorMsg= error.responseText;
					var obj = $.parseJSON(errorMsg);
					alert("修改失败\n\n" +　obj.message);
				}
			},
	        success: function(p) {
	        	if(p == null) {
	        		
	        		alert("系统错误，请联系管理员");
	        		return false;
	        	}
	        	var editableTD = changedtr.children(".edit_td").has('.editbox');
	        	refreshEditedTD(editableTD,p);
	        	
	            alert("修改成功");
		    },
	        render: changedtr
	   	});
		makeTRUneditable(activeTR);
	   	activeTR = null;
	};
	
	//final modify
	var saveTR = function() {
		if(!activeTR)
			return;
		var addTR = activeTR;	
		//when add ,all edit box must sumbit
	    var editTD = addTR.children("td");
	    var operTD = addTR.children(".oper_td");
	    
	    var dataString=validateAndCreateParamsStr(editTD);
         if(!dataString)
        	 return;
         //fix tomcat 7 compability
         var postURL=baseURL;
         if(!!baseURL&&baseURL.length>0&&baseURL.charAt(baseURL.length-1)==='/'){
        	 postURL=baseURL.substring(0,baseURL.length-1);
         }
       
         $.ajax({
         	type: "POST",
         	dataType : 'json', 
            url: postURL,
            data: dataString,
            cache: false,
            statusCode: {
				400: function(error) {
					var errorMsg = error.responseText;
					var obj = $.parseJSON(errorMsg);
					alert("添加失败\n\n" +　obj.message);
				}
			},
            success: function(p) {
            	if(p == null) {	        		
            		alert("系统错误，请联系管理员");
	        		return false;
	        	}
            	refreshEditedTD(editTD,p);
            
                alert("添加成功");
           		addTR.attr("id", p.id);
           		
           		//如果有 input（checkbox）则进行初始化
           		var cb = addTR.find("td:first input[type='checkbox']");
           		if(cb.length != 0) {
           			cb.val(p.id);
           		}
                operTD.html('<a class="save_a" href="#" style="display: none"></a><a class="delete_a" href="#"></a>');
                // 对于新添加的行需要重新绑定事件
                addTR.children(".oper_td").children(".save_a").click(function() {	
					editTR(addTR);
			   		makeTRUneditable(addTR);
			   		// 屏蔽table.find(".edit_tr").click()事件
			   		return false;
             	});
                addTR.children(".oper_td").children(".delete_a").click(function() {
             	    var ID = addTR.attr("id");
					deleteTR(addTR);
             	});
             	makeTRUneditable(addTR);
             	//重新绑定事件
             	addTR.find(".edit_td").click(clickEditTR);
             	// 成功保存
             	activeTR = null;
            }
         });
	};
	
	var deleteTR = function(delTR) {
		
		var deleteConfirm = confirm('确定删除此条记录么?')
		if(!deleteConfirm)
			return false;
		var ID = delTR.attr("id");
	    var dataString = '{';
	    if(!!model) {
	    	 for (attr in model){
					dataString += '"' + attr + '":' + model[attr]+',';
			 }
	     }
	     dataString += '"id":' + ID;
	     dataString += '}';
	     $.ajax({
	         type: "DELETE",
	         dataType: 'json', 
	         contentType: "application/json",
	         url: baseURL + ID,        
	         data: dataString,
	         cache: false,
	         statusCode: {
	        	400: function(error) {
					var errorMsg = error.responseText;
					var obj = $.parseJSON(errorMsg);
					alert("删除失败\n\n" +　obj.message);
	        	} 
	         },
	         success: function(p) {
	        	 if(p == null) {
	        	 	 alert("系统错误，请联系管理员");
	        		 return false;
	        	 }
	        	 delTR.remove();
	         }
	     });	
	};
 	/***************init***********************/
	
	
	this.find(".edit_tr .edit_td").click(clickEditTR);	
	this.find(".save_a").click(function() {							
		editTR(activeTR);	
   		return false;
   	});
   	
	var editboxs = this.find(".editbox");
	// 屏蔽 table.find(".edit_tr").click()事件
	editboxs.click(function() {
		return false;
	});
	
    $(document).click(function() {
		if(!!activeTR) {
			var trID = activeTR.attr("id");
			if(trID != "0")
				makeTRUneditable(activeTR);
			else
				activeTR.remove();
			activeTR = null;
		}
    });
	
    //bind delete_a click event
	this.find(".delete_a").click(function() {
		var delTR = $(this).closest('tr');
   	    var ID = delTR.attr("id");   	                   	       
   	    deleteTR(delTR);
   	    return false;
    });
	
	return {
		addRecord: addTR
	};
}
})(jQuery,window);
