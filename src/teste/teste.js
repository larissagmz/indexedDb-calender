import { openDatabase, getAllItems } from "../dataBaseUtils.js"; 
import { setCalendarioAno } from "./calendarioAno.js";

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

       
        var acrescimo_inicio = dia_semana_inicio;
        for (let i = 0; i < acrescimo_inicio; i++) {
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

    console.log(fulYearArray);
    return fulYearArray;
};


 export const addEventDay = async () => {
    try {
        const db = await openDatabase(); 
        const eventos = await getAllItems(db, "eventos");
        const yearData = getYear(2024);
        console.log(eventos);
        
        eventos.forEach((evento) => {
            const eventoData = evento.dataInicio || evento.data;
            if (!eventoData) return;

            yearData.forEach((mes) => {
                mes.monthDay.forEach((dia) => {
                    if (dia.data === eventoData) {
                        
                        const existeEvento = dia.evento.some(
                            (ev) => ev.descricao === evento.descricao
                        );

                        if (!existeEvento) {
                            dia.evento.push(evento);
                        }
                    }
                });
            });
        });
        
        setCalendarioAno(yearData);
    } catch (error) {
        console.error("Erro ao adicionar eventos ao calendário:", error);
    }
};