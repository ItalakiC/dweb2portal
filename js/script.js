// Função para mostrar e deixar atualizado o relógio
function atualizarRelogio() {
    document.getElementById('relogio').textContent = new Date().toLocaleString('pt-BR');
}

// Atualiza o relógio chamando a função a cada 1 segundo
atualizarRelogio();
setInterval(atualizarRelogio, 1000);

// Botão de tema claro e escuro, localiza por id o botão "escuta" o click do user
document.getElementById('botaoTema').addEventListener('click', function () {
    // adiciona a classe dar mode ao corpo do html se não existir e remove se ja existir, sendo um toggle
    document.body.classList.toggle('dark-mode');
});

// Quantidade maxima de noticias antes de aparecer o mostrar mais
const LIMITE = 6;
// converte tudo que seja .bloco-noticia e converte em array
const cards = Array.from(document.querySelectorAll('.bloco-noticia'));
const campoBusca = document.getElementById('busca');
const botoesFiltro = document.querySelectorAll('.filtro');
const botaoMais = document.getElementById('botaoMais');
const semResultado = document.getElementById('sem-resultado');

// Guarda a categoria ativada, inicia exibindo todas
let categoriaAtual = 'todas';
// Se o user expandiu a lista = true, se não = false, inicia como false para aparecer o botão mostrar mais
let mostrarTodos = false;

// Todo texto buscado sera tratado como minuscula
function normalizar(texto) {
    return texto.toLowerCase();
}
// Calcula e atualiza quais noticias devem aparecer na tela 
function atualizarLista() {
    // Tira espaços extras nas pontas e transfoma em minuscula para o texto que for digitado na busca
    const termo = normalizar(campoBusca.value.trim());

    // Filtra os cards e retorna so os correspondentes aos filtros
    const correspondentes = cards.filter(function (card) {
        // Verifica se a categoria do card bate com a selecionada ou se esta em todas
        const categoriaOk = categoriaAtual === 'todas' || card.dataset.categoria === categoriaAtual;
        const titulo = normalizar(card.querySelector('h5').textContent);
        // Retorna verdadeira se a categoria estiver correta e o titulo tiver o termo buscado
        return categoriaOk && titulo.includes(termo);
    });

    // Percorre a lista completa de noticias para aplicar as regras de visibilidade
    cards.forEach(function (card) {
        // Descobre a posição do card dentro da lista dos cards que foram filtrados (-1 se não passou)
        const indice = correspondentes.indexOf(card);
        //Determina que o card sera visivel se passou no fitro
        const visivel = indice !== -1 && (mostrarTodos || indice < LIMITE);
        // Aplica propriedade de esconder se true e exibir se false
        card.hidden = !visivel;
    });

    // Esconde a mensagem de sem resuktados se algum card foi encontrado
    semResultado.hidden = correspondentes.length > 0;
    // Esconde o botao de mostrar mais caso a lista ja tenha sido expandida ou não houver quantidade suficiente para isso
    botaoMais.parentElement.hidden = mostrarTodos || correspondentes.length <= LIMITE;
}

// Faz o evento de click individual para cada botao de categoria
botoesFiltro.forEach(function (botao) {
    botao.addEventListener('click', function () {
        // Remove a classe CSS atvio de todos os botões de filtro para desmarcar
        botoesFiltro.forEach(function (b) { b.classList.remove('ativo'); });
        // Adiciona a classe ativo ao botão que foi clicado
        botao.classList.add('ativo');
        // Lê o valor do atributo data-filtro do botão clicado e atualiza 
        categoriaAtual = botao.dataset.filtro;
        // Reseta o estado de mostrar mais para fechar lista ao trocar de categoria
        mostrarTodos = false;
        atualizarLista();
    });
});

// Pega a digitação no campode busca em tempo real
campoBusca.addEventListener('input', function () {
    // Reseta o mostrar mais
    mostrarTodos = false;
    atualizarLista();
});

// Pega o clique no botão mostrar mais
botaoMais.addEventListener('click', function () {
    // Altera o estado indicando que todos os card q foram filtrados devem ser mostrados
    mostrarTodos = true;
    atualizarLista();
});

atualizarLista();

// Formulário de e-mail ao enviar, só limpa o campo
document.getElementById('formEmail').addEventListener('submit', function (e) {
    // Previne o carregamento automatico da pagina padrão de envios de formulario
    e.preventDefault();
    // Reseta o campo digitado pelo user
    this.reset();
});