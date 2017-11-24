
/* Função para realizar o Login e o Cadastro de novos usuários
   Caso o Login e/ou cadastro aconteça com sucesso, abre a página do chat
*/
function handle_user_actions(post_validation_action){

  var oReq = new XMLHttpRequest();

  oReq.onreadystatechange = function() {
    if (oReq.readyState == XMLHttpRequest.DONE) {
        /* Valida qual será a próxima ação */
        if(post_validation_action == "login"){
           if(this.responseText.length > 21){
             localStorage.setItem("connected_user", document.getElementById("user_name").value);
             document.getElementById("user_name").value = "";
             open('conversation_room.html', '_self')
           }
           else {
             alert('Usuário não cadastrado!')
           }
        }
        else if (post_validation_action == "register") {
            if(this.responseText.length > 21){
              alert('Usuário já cadastrado!')
            }
            else{

              var oReq2 = new XMLHttpRequest();

              oReq2.onreadystatechange = function() {
                  if (oReq2.readyState == XMLHttpRequest.DONE) {
                    if(this.responseText == 'OK'){
                      localStorage.setItem("connected_user", document.getElementById("user_name").value);
                      open('conversation_room.html', '_self')
                    }
                    else {
                      alert('Falha ao registrar usuário. Retorno: ' + this.responseText)
                    }
                }
              }
              oReq2.open("POST", "http://www.angelito.com.br/webchat/user?nickname=" + document.getElementById("user_name").value);
              oReq2.send();
            }
        }
    }
  }

  oReq.open("GET", "http://www.angelito.com.br/webchat/messages?nickname=" + document.getElementById("user_name").value);
  oReq.send();
}

function login(){
    handle_user_actions('login');
}

function register_new_user(){
  handle_user_actions('register');
}

function remove_all_users(){
  var oReq = new XMLHttpRequest();

  oReq.onreadystatechange = function() {
      if (oReq.readyState == XMLHttpRequest.DONE) {
        alert('Todos usuários foram removidos com sucesso!')
    }
  }

  oReq.open("GET", "http://www.angelito.com.br/webchat/reset_users");
  oReq.send();
}

function remove_all_messages(){
  var oReq = new XMLHttpRequest();

  oReq.onreadystatechange = function() {
      if (oReq.readyState == XMLHttpRequest.DONE) {
        alert('Todas as mensagens foram removidas com sucesso!')
    }
  }

  oReq.open("GET", "http://www.angelito.com.br/webchat/reset_messages");
  oReq.send();
}
