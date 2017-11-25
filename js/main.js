
/* Evento DOMContentLoaded */
document.addEventListener('DOMContentLoaded', verify_desconected_user);

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
             show_message_box_info('Usuário não cadastrado!')
           }
        }
        else if (post_validation_action == "register") {
            if(this.responseText.length > 21){
              show_message_box_info('Usuário já cadastrado!')
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
                      show_message_box_error('Falha ao registrar usuário. Retorno: ' + this.responseText)
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
        show_message_box_info('Todos usuários foram removidos com sucesso!')
    }
  }

  oReq.open("GET", "http://www.angelito.com.br/webchat/reset_users");
  oReq.send();
}

function remove_all_messages(){
  var oReq = new XMLHttpRequest();

  oReq.onreadystatechange = function() {
      if (oReq.readyState == XMLHttpRequest.DONE) {
        show_message_box_info('Todas as mensagens foram removidas com sucesso!');
    }
  }

  oReq.open("GET", "http://www.angelito.com.br/webchat/reset_messages");
  oReq.send();
}

function show_message(message, message_type){
  var message_box = document.getElementById("message_box");

  if(message_box != undefined){
    close_message();
  }

  var header_selector = document.getElementsByClassName("header")[0];

  var divMessage = document.createElement("div");
  divMessage.className = "message_generic " + message_type;
  divMessage.setAttribute("id", "message_box");

  var spanMessage = document.createElement("span");
  spanMessage.innerHTML = message;

  var closeButton = document.createElement("button");
  closeButton.innerHTML = "X";
  closeButton.setAttribute("onclick", "close_message()");

  divMessage.appendChild(spanMessage);
  divMessage.appendChild(closeButton);
  header_selector.appendChild(divMessage);

}

function show_message_box_info(message){
  show_message(message, "message_info");
}

function show_message_box_error(message){
  show_message(message, "message_error");
}

function close_message(){
  var message_box = document.getElementById("message_box");
  message_box.parentNode.removeChild(message_box);
}

function verify_desconected_user(){
  var user_desconected = localStorage.getItem("user_desconected");
  if(user_desconected == "true"){
    show_message_box_error('O seu usuário foi desconectado.');
  }
}
