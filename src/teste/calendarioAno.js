// Declara um array vazio que vai armazenar o calendário do ano inteiro.
// Essa variável está no escopo do módulo e funciona como estado interno.
let calendarioAno = [];

// Função que retorna o conteúdo atual de 'calendarioAno'.
// Útil para outros arquivos acessarem o estado atual do calendário.
export const getCalendarioAno = () => calendarioAno;

// Função que atualiza o valor de 'calendarioAno' com um novo array passado por parâmetro.
// Permite a outros arquivos modificar o estado do calendário.
export const setCalendarioAno = (novoAno) => {
  calendarioAno = novoAno;
};