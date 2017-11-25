/* Global */
var connected_user = "";
var number_of_connected_users = 0;
var number_of_messages = 0;

/* Evento DOMContentLoaded */
document.addEventListener('DOMContentLoaded', DOM_ready);

/* Função que será executada assim que a DOM estiver pronta, mais rapida que evento "load" */
function DOM_ready(){

  /* Recupera o usuário conectado */
  connected_user = localStorage.getItem("connected_user");

  /* Valida se o usuário foi informado */
  if(connected_user == "undefined"){
    open('index.html', '_self');
  }

  /* Atualiza a tela a primeira vez */
  update_connected_user();
  get_users_and_messages();

  /* Habilita timer para próximas atualizações a cada 2 segundos */
  setInterval(get_users_and_messages, 2000);
}

function get_users_and_messages(){
  get_users_rest();
  get_messages_rest();
};

/* Popula usuários conectados na lista via manipulação dos elementos HTML*/
function populate_user_list(){
  var connected_user_list = document.getElementsByClassName("connected_user_list")[0];
  /* Acessa retorno de XMLHttpRequest */
  var users = JSON.parse(this.responseText);

  if(users.length != number_of_connected_users){
    number_of_connected_users = users.length;

    connected_user_list.innerHTML = "";

    var li = document.createElement("li");
    li.innerHTML = 'Usuários conectados: ';
    connected_user_list.appendChild(li);

    /* Percorre todos os itens retornados e popula lista */
    for(var i = 0; i < users.length; i++) {
        var li = document.createElement("li");
        li.innerHTML = users[i] + ' |';
        connected_user_list.appendChild(li);
    }
  }
};

/* Atribui o usuário conectado no campo equivalente */
function update_connected_user(){
  var connected_user_selector = document.getElementById("current_user");
  connected_user_selector.innerHTML = connected_user;
}

/* Busca lista de usuários conectados e atribui ao evento load */
function get_users_rest(){
  var oReq = new XMLHttpRequest();
  oReq.addEventListener("load", populate_user_list);
  oReq.open("GET", "http://www.angelito.com.br/webchat/users");
  oReq.send();
};

/* Busca mensagens enviadas e adiciona os elementos na tela */
function get_messages_rest(){
   var oReq = new XMLHttpRequest();

   oReq.onreadystatechange = function() {
     if (oReq.readyState == XMLHttpRequest.DONE) {
       var messages = JSON.parse(this.responseText);
       var messages_selector = document.getElementById("messages_container");

       if(messages.length != number_of_messages){
         number_of_messages = messages.length;
         messages_selector.innerHTML = "";

         for(var i = 0; i < messages.length; i++) {
             var div = document.createElement("div");
             div.className = "conversation_messages";

             var span = document.createElement("span");
             span.className = "user_stamp";
             span.innerHTML = '<strong>[' + messages[i].datetime + ']</strong> ' + messages[i].user + ' diz: ' ;
             div.appendChild(span);

             var span2 = document.createElement("span");
             span2.className = "user_message";
             span2.innerHTML = messages[i].textmsg ;
             div.appendChild(span2);

             messages_selector.appendChild(div);
         }
         window.scrollTo(0, document.querySelector(".messages_container").scrollHeight);
      }
     }
   }

   oReq.open("GET", "http://www.angelito.com.br/webchat/messages?nickname=" + connected_user);
   oReq.send();
};

/* Envia mensagem e caso sucesso, atualiza as mensagens na tela */
function send_message_rest(){
  var oReq = new XMLHttpRequest();

  oReq.onreadystatechange = function() {
    if (oReq.readyState == XMLHttpRequest.DONE) {
        /*Verifica se o usuário foi desconectado */
        if(this.responseText != 'Erro enviando mensagem. Usuário desconectado.' ){
          /*Limpa mensagem da caixa de texto */
          document.getElementById("inputMessageText").value = "";
          get_messages_rest();
        }
        else {
          localStorage.setItem("user_desconected", true);
          open('index.html', '_self');
        }
    }
  }

  oReq.open("POST", "http://www.angelito.com.br/webchat/send?nickname=" + connected_user +'&textmsg=' + document.getElementById("inputMessageText").value);
  oReq.send();
}
