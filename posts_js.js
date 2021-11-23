$(document).ready(function(){

	$("#bBuscar").click(function() {
		buscar();
	});

	function buscar(id) {
		var urlBase = 'https://localhost:4567/posts';
		if(arguments.length > 0) {
			urlBase += "/" + id;
		}
		$.ajax({
			type: 'GET',
            dataType: 'json',
			url: urlBase,
			success: function(data) {
				var posts = eval(data);
				if(posts.length > 0){
					mostrarTabela(posts);
				}
				else{
					atualizarPost(posts);
				}
			},
			error: function(data){
				alert("Erro de comunicação com o Banco de Dados local.");
			}
		})
	}

	function mostrarTabela(posts){
		var tabela = "<table id=\"posts\"><tr><th>Id</th><th>Título</th><th>Categoria</th><th>Conteúdo</th><th>Versão</th></tr>";

		for(i=0 ; i < posts.length; i++) {
			tabela+="<tr><td class=\"identificador\">";
			tabela+=posts[i].id;
			tabela+="</td>";
			tabela+="<td>"
			tabela+=posts[i].title;
			tabela+="</td>"
			tabela+="<td>"
			tabela+=posts[i].categories;
			tabela+="</td>"
			tabela+="<td>"
			tabela+=posts[i].content;
			tabela+="</td>"
			tabela+="<td>"
			tabela+=posts[i].version;
			tabela+="</td>"
			tabela+="</tr>";
		}
		tabela+="</table>";

		$('#dados').html(tabela);
        $('#bBuscar').css('display', 'none');
		$('#btnAdicionar').css('display', 'inline');
		$('#posts').find('tr').click(function() {
			var id = $(this).find('td:first').text();
			buscar(id);
		});
        $('#btnAdicionar').click(function() {
            novoPost();
        })
	}

    function novoPost(){
        dialogAlterar.showModal();

        var urlBase = 'https://localhost:4567/posts';

        $('#btnAddPost').click(function() {
            const dadosForm = {
                id: "3",
                title: $('#caixaTitulo').val(),
                categories: $('#caixaCategoria').val(),
                content: $('#caixaConteudo').val(),
                version: $('#caixaVersao').val(),
            };

			var novoPost = JSON.stringify(dadosForm);

			$.ajax({
				type: 'POST',
				dataType: 'json',
				data: novoPost,
				url: urlBase,
				success: function() {
					alert("Sucesso");
					buscar();
				},
				error: function(){
					alert("Erro de comunicação com o Banco de Dados local.");
				}
			});
			dialogAlterar.close();
        })
    }

	function atualizarPost(posts){
		dialogAlterar.showModal();

		$('#caixaPost').val(posts.id);
        $('#caixaPost').ready();
		$('#caixaTitulo').val(posts.title);
		$('#caixaCategoria').val(posts.categories);
		$('#caixaConteudo').val(posts.content);
		$('#caixaVersao').val(posts.version);

		$('#btnSalvar').click(function() {
			var urlBase = 'https://localhost:4567/posts';
			urlBase += "/" + posts.id;

			posts.title = $('#caixaTitulo').val();
			posts.content = $('#caixaConteudo').val();

			var objeto = JSON.stringify(posts);
 
			$.ajax({
				type: 'PUT',
				dataType: 'json',
				data: objeto,
				url: urlBase,
				success: function() {
					alert("Sucesso");
					buscar();
				},
				error: function(){
					alert("Erro de comunicação com o Banco de Dados local.");
				}
			});
			dialogAlterar.close();
		});

		$('#btnExcluir').click(function() {
			var urlBase = 'https://localhost:4567/posts';
			urlBase += "/" + posts.id;

			$.ajax({
				type: 'DELETE',
				url: urlBase,
				success: function() {
					alert("Excluído com Sucesso!");
					buscar();
				},
				error: function(){
					alert("Erro de comunicação com o Banco de Dados local.");
				}
			});
			dialogAlterar.close();
		})
	}
})