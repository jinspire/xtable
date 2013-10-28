<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<script type="text/javascript" src="/euphrates/js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="/euphrates/js/jquery.xtable.js"></script>
<script type="text/javascript">
$(document).ready(function()
				{

	var product_tr_html='<tr id="0" class="edit_tr">'+
	'<td id="id" class="edit_td"><span class="text"></span><input type="text" value="" class="editbox"/></td>'+
	'<td id="name" class="edit_td"><span class="text"></span><input type="text" value="" class="editbox"/></td>'+
    '<td id="price" class="edit_td"><span class="text"></span><input type="text" value="" class="editbox"/> </td>'+    
	'<td class="oper_td"><a  class="save_a" href="#">add</a></td>'+
    '</tr>';

    var config={
	 		baseURL: '/euphrates/products/',
	        trHTML: product_tr_html,
	        tdCfgs: {}
		};
		
       
		var table=$("#datatable").xtable(config);
		
		$("#add").click(function() {
			table.addRecord();
			return false;
		}); 	
	
									                      		
 });
      		           
</script>

<link rel="stylesheet" type="text/css" href="/euphrates/css/table.css" />
</head>
<body>
<table id="datatable" class="ui-table">
	<tbody>
		<a id="add" href="#">增加</a>
		<tr class="head">
			<th>ID</th>
			<th>名称</th>
			<th>价格</th>
			<th>操作</th>
		</tr>

		<c:forEach var="product" items="${products}">
			<tr id="${product.id}" class="edit_tr">

				<td id="id" class="edit_td">
				<span class="text">${product.id}</span>
                	<input type="text" value="${product.id}" class="editbox"/>
				</td>

				<td id="name" class="edit_td">
				<span class="text">${product.name}</span>
                <input type="text" value="${product.name}" class="editbox"/>
				</td>
                <td id="price" class="edit_td">
				<span class="text">${product.price}</span>
                <input type="text" value="${product.price}" class="editbox"/>
				</td>
				<td class="oper_td">
					<a class="save_a" href="#" style="display: none">保存</a>
					<a class="delete_a" href="#">删除</a>
				</td>
			</tr>
		</c:forEach>
	</tbody>
</table>

</body>
</html>