// Variáveis para modal e elementos de formulário
const modal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');
const taskDescriptionInput = document.getElementById('taskDescription');
const taskPrioritySelect = document.getElementById('taskPriority');
const errorMessage = document.getElementById('error-message');
let currentColumnElement = null;
let currentCardElement = null;

// Fechar modal ao clicar no ícone de fechar
document.getElementById('close-modal').onclick = function() {
    modal.style.display = 'none';
};

// Função para abrir o modal para criar ou editar cards
function openModal(columnElement, cardElement = null) {
    currentColumnElement = columnElement;
    currentCardElement = cardElement;
    modal.style.display = 'block';
    
    if (cardElement) {
        taskDescriptionInput.value = cardElement.querySelector('.card-title').textContent;
        const priorityClass = cardElement.querySelector('.badge').classList[1];
        taskPrioritySelect.value = priorityClass;
        document.getElementById('delete-card').style.display = 'inline'; // Mostrar botão de exclusão
    } else {
        taskDescriptionInput.value = '';
        taskPrioritySelect.value = '';
        document.getElementById('delete-card').style.display = 'none'; // Ocultar botão de exclusão
    }
}

// Lógica para excluir o card
document.getElementById('delete-card').onclick = function() {
    if (currentCardElement) {
        currentCardElement.remove(); // Remove o card do DOM
        modal.style.display = 'none'; // Fecha o modal
        currentColumnElement = null; // Limpa referência da coluna
        currentCardElement = null; // Limpa referência do card
    }
};


// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
};

// Função ao começar a arrastar o card
function dragStart(event) {
    // Define o id do card que está sendo arrastado
    event.dataTransfer.setData('text/plain', event.target.id);
}

// Permitir que o card seja solto no alvo
function allowDrop(event) {
    event.preventDefault();
}

// Função para soltar o card em outra coluna
function dropCard(event) {
    event.preventDefault();

    // Pegar o id do card que está sendo arrastado
    const cardId = event.dataTransfer.getData('text/plain');
    const card = document.getElementById(cardId);

    // Adicionar o card ao contêiner de destino
    const targetColumn = event.currentTarget;
    targetColumn.appendChild(card);
}

// Função para criar ou editar card
taskForm.onsubmit = function(event) {
    event.preventDefault(); // Prevenir recarregamento da página

    const description = taskDescriptionInput.value.trim();
    const priority = taskPrioritySelect.value;

    // Verificar se os campos foram preenchidos
    if (!description || !priority) {
        errorMessage.textContent = 'Por favor, preencha a descrição e escolha a prioridade da tarefa.';
        errorMessage.style.display = 'block';
        return; // Impedir que o formulário seja enviado
    } else {
        errorMessage.style.display = 'none';
    }

    if (currentCardElement) {
        // Editando um card existente
        currentCardElement.querySelector('.card-title').textContent = description;
        currentCardElement.querySelector('.badge').className = `badge ${priority}`;
        currentCardElement.querySelector('.badge span').textContent = priority === 'high' ? 'Alta Prioridade' :
                                                                      priority === 'med' ? 'Prioridade Média' : 'Baixa Prioridade';
    } else {
        // Criando um novo card
        const card = document.createElement('div');
        card.className = 'card-element';
        card.id = `card-${Date.now()}`; // Criar um ID único para o card
        card.draggable = true; // Permitir arrastar o card

        // Estrutura do card
        card.innerHTML = `
            <div class="badge ${priority}">
                <span>${priority === 'high' ? 'Alta Prioridade' : priority === 'med' ? 'Prioridade Média' : 'Baixa Prioridade'}</span>
            </div>
            <p class="card-title">${description}</p>
        `;

        // Eventos para drag-and-drop
        card.addEventListener('dragstart', dragStart);

        // Permitir edição ao clicar no card
        card.addEventListener('click', function() {
            openModal(currentColumnElement, card);
        });

        currentColumnElement.querySelector('.kanban-cards').appendChild(card);
    }

    modal.style.display = 'none'; // Fechar o modal após salvar
    currentColumnElement = null;
    currentCardElement = null;
};

// Configuração para colunas que aceitam soltar cards
document.querySelectorAll('.kanban-column').forEach(column => {
    const columnCards = column.querySelector('.kanban-cards');
    columnCards.addEventListener('dragover', allowDrop);
    columnCards.addEventListener('drop', dropCard);
});