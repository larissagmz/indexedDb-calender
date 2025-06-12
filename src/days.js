// Função que cria um array de datas iniciando no primeiro dia de cada mês entre datas.inicio e datas.fim
function intervalo(datas) {
    var dia = 24 * 60 * 60 * 1000;
    var resultado = [];
    for (
        var i = datas.inicio.getTime(), fim = datas.fim.getTime();
        i <= fim;
    ) {
        var ano = new Date(i).getFullYear();
        var mes = new Date(i).getMonth();
        var data_inicio_mes = new Date(ano, mes, 1, 15, 0, 0, 0);
        var data_fim_mes = new Date(
            data_inicio_mes.getFullYear(),
            data_inicio_mes.getMonth() + 1,
            0
        );
        resultado.push(data_inicio_mes);
        i = data_fim_mes.getTime() + dia;
    }
    return resultado;
}

// Função que cria um calendário completo do ano com os dias e estrutura os meses
export const getYear = (year) => {
    var datas = {
        inicio: new Date(year, 0, 1, 15, 0, 0, 0),
        fim: new Date(year, 11, 31, 15, 0, 0, 0),
    };

    var calendario = intervalo(datas);
    var fulYearArray = [];

    for (var x = 0; x < calendario.length; x++) {
        var data_inicio = calendario[x];
        var ultimoDiaDoMes = new Date(
            data_inicio.getFullYear(),
            data_inicio.getMonth() + 1,
            0
        );
        var fim = ultimoDiaDoMes.getDate();
        var array_calendario = [];

        var dia_semana_inicio = new Date(
            data_inicio.getFullYear(),
            data_inicio.getMonth(),
            1
        ).getDay();
        var dia_semana_fim = ultimoDiaDoMes.getDay();

        for (let i = 0; i < dia_semana_inicio; i++) {
            array_calendario.push("--");
        }

        for (let i = 1; i <= fim; i++) {
            const dia = ("0" + i).slice(-2);
            const mesFormatado = ("0" + (data_inicio.getMonth() + 1)).slice(-2);
            const data = `${year}-${mesFormatado}-${dia}`;

            array_calendario.push({
                data: data,
                evento: []
            });
        }

        var acrescimo_fim = dia_semana_fim < 6 ? 6 - dia_semana_fim : 0;
        for (let i = 0; i < acrescimo_fim; i++) {
            array_calendario.push("--");
        }

        let nomeMes = data_inicio.toLocaleDateString('pt-BR', { month: 'long' });
        nomeMes = nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

        let mesObj = {
            name: nomeMes,
            monthDay: array_calendario,
            event: [],
        };

        fulYearArray.push(mesObj);
    }

    return fulYearArray;
};
import { events } from "./data.js";



// Função que simula eventos e adiciona ao calendário
 // certifique-se de importar corretamente

export const addEventDay = () => {
    const yearData = getYear(2024); // ou o ano que desejar

    events.forEach((evento, index) => {
        const inicio = new Date(evento.dataInicio + "T00:00:00");
        const fim = new Date(evento.dataFim + "T00:00:00");
        const id = index + 1;

        let dataAtual = new Date(inicio);

        while (dataAtual <= fim) {
            const ano = dataAtual.getFullYear();
            const mes = dataAtual.getMonth();
            const dia = ("0" + dataAtual.getDate()).slice(-2);
            const mesFormatado = ("0" + (mes + 1)).slice(-2);
            const dataStr = `${ano}-${mesFormatado}-${dia}`;

            yearData[mes].monthDay.forEach((diaObj) => {
                if (diaObj !== "--" && diaObj.data === dataStr) {
                    diaObj.evento.push({
                        id,
                        ...evento
                    });
                }
            });

            dataAtual.setDate(dataAtual.getDate() + 1);
        }
    });

    return yearData;
};