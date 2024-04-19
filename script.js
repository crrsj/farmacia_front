

function cadastrarRegistro(nome,imagem,validade,quantidade) {
    
    // Captura os valores do formulário
    
    var  nome = document.getElementById("nome").value;
    var  imagem = document.getElementById("imagem").value;
    var  validade = document.getElementById("validade").value;
    var  quantidade = document.getElementById("quantidade").value;
    
    // Cria um objeto com os dados a serem enviados
    var data = {
        nome: nome,
        imagem: imagem,
        validade: validade,
        quantidade: quantidade        
    };

    // Envia os dados para o servidor
    fetch('http://localhost:8080/remedio', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar registro.');
            
        }
        return response.json();
    })
    .then(data => {
        console.log( 'Registro cadastrado com sucesso:', data);
        alert("Cadastro realizado com sucesso !")
        fetchDataAndPopulateTable();
    })
    .catch(error => {
        console.error('Erro:', error);
    });
     
     document.getElementById("nome").value ="";
     document.getElementById("imagem").value ="";
     document.getElementById("validade").value ="";
     document.getElementById("quantidade").value ="";    
    // window.location.href = "";
   
}
function validarFormulario() { 
      
    var nome = document.getElementById('nome').value;
    var imagem = document.getElementById('imagem').value;
    var validade = document.getElementById('validade').value;
    var quantidade = document.getElementById('quantidade').value;
   
    if (nome === '') {
        alert('Por favor, preencha o campo Nome.');
        return false;
    }
    if (imagem === '') {
        alert('Por favor, preencha o campo imagem.');
        return false;
    }
    if (validade === '') {
        alert('Por favor, preencha o campo validade.');
        return false;
    }
    if (quantidade === '') {
        alert('Por favor, preencha o campo quantidade.');
        return false;
    }

    
    // Se a validação passar, você pode chamar a função para salvar os registros
     cadastrarRegistro(nome,imagem,validade,quantidade);

    // Retorna true para permitir o envio do formulário após salvar os registros
    return true;
}
async function fetchDataAndPopulateTable() {
    try {
      // Substitua 'URL_DA_SUA_API' pela URL real da sua API
      const response = await fetch( 'http://localhost:8080/remedio');
      const data = await response.json();

      // Limpa a tabela antes de inserir novos dados
      const tbody = document.querySelector('#tabela tbody');
      tbody.innerHTML = '';

      // Preenche a tabela com os dados recebidos da API
      data.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.id}</td>
          <td>${item.nome}</td>
          <td><img src="${item.imagem}" alt="${item.nome}" style="max-width: 100px; max-height: 100px;"></td>
          <td>${item.validade}</td>
          <td>${item.quantidade}</td>         
          <td><button  class="btn btn-warning"  onclick="buscarPorId(${item.id})">Editar</button></td>          
          <td><button  class="btn btn-danger" onclick="deletarRegistro(${item.id})">Excluir</button></td>`;
                       
        tbody.appendChild(row);
      });
    } catch (error) {
      console.error('Erro ao buscar e preencher dados:', error);
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
  // Chama a função para buscar e preencher os dados quando a página carrega
   fetchDataAndPopulateTable();
});

async function updateUserData() {    
    const idInput =  document.getElementById("id");
    const nomeInput = document.getElementById("nome");   
    const validadeInput = document.getElementById("validade");
    const quantidadeInput = document.getElementById("quantidade");
    
    
      
    const updateId =  idInput.value
    const updateNome = nomeInput.value  
    const updateValidade = validadeInput.value 
    const updateQuantidade = quantidadeInput.value 
   
  
    try {
      const response =  await fetch(`http://localhost:8080/remedio`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: updateId,
          nome: updateNome,         
          validade: updateValidade,
          quantidade: updateQuantidade,
          
          
          
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} - ${response.statusText}`);
      }
  
      alert('Dados do usuário atualizados com sucesso!');
      fetchDataAndPopulateTable();          
    } catch (error) {
      console.error(`Erro durante a atualização dos dados: ${error.message}`);
    }
    document.getElementById("nome").value = "";   
    document.getElementById("validade").value ="";
    document.getElementById("quantidade").value ="";
    
  }
 

 
    function preencherFormulario(user) {
    document.getElementById('id').value = user.id;
    document.getElementById('nome').value = user.nome;
    document.getElementById('imagem').value = user.imagem;
    document.getElementById('validade').value = user.validade;          
    document.getElementById('quantidade').value = user.quantidade;
    console.log('Registro encontrado:', user);

   }
  
   



  function showModal() {
    var myModal = document.getElementById('myModal');
    if (myModal) {
        var myInput = document.getElementById('myInput');
        if (myInput) {
            myModal.addEventListener('shown.bs.modal', function () {
                myInput.focus();
            });
            var modalInstance = new bootstrap.Modal(myModal);
            modalInstance.show();
        } else {
            console.error("Elemento 'myInput' não encontrado.");
        }
    } else {
        console.error("Elemento 'myModal' não encontrado.");
    }
}

 function buscarPorId(id) {
   fetch('http://localhost:8080/remedio/' + id)
    .then(response => response.json())    
    .then(user => {
      preencherFormulario(user) ;
      showModal();
    
    })
    .catch(error => console.error('Error fetching user data:', error));
}

  function preencherFormulario(user) {
  document.getElementById('id').value = user.id;
  document.getElementById('nome').value = user.nome;
  document.getElementById('validade').value = user.validade;
  document.getElementById('quantidade').value = user.quantidade;
   

}


async function deletarRegistro(id) {
  try {
      
      const url = `http://localhost:8080/remedio/${id}`;

      
      const confirmacao = confirm("Tem certeza que deseja excluir o remédio?");

      
      if (confirmacao) {
          const options = {
              method: 'DELETE'
          };

          const response = await fetch(url, options);
          if (!response.ok) {
              throw new Error('Erro ao deletar o registro');
          }

          console.log('Registro deletado com sucesso');
          
      } else {
          console.log('Exclusão cancelada pelo usuário');
          
      }
  } catch (error) {
      console.error('Erro:', error);
      
  }
  fetchDataAndPopulateTable();
}