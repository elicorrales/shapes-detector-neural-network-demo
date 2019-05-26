const messagesElem = document.getElementById('messages');
const clearMessages = () => {
    messagesElem.className = '';
    messagesElem.innerHTML = '';
}
const showMessages = (type, messages) => {
    messagesElem.className = 'alert alert-' + type;
    messagesElem.innerHTML = messages;
}