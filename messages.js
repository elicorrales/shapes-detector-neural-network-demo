const messagesElem = document.getElementById('messages');
const clearMessages = () => {
    messagesElem.className = '';
    messagesElem.innerHTML = '';
}
const showMessages = (type, messages) => {
    messagesElem.className = 'alert alert-' + type;
    messagesElem.innerHTML = messages;
}

const secondaryMessagesElem = document.getElementById('secondaryMessages');
const clearSecondaryMessages = () => {
    secondaryMessagesElem.className = '';
    secondaryMessagesElem.innerHTML = '';
}
const showSecondaryMessages = (type, messages) => {
    secondaryMessagesElem.className = 'alert alert-' + type;
    secondaryMessagesElem.innerHTML = messages;
}
