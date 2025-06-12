// Importa a função que retorna o estado do calendário anual
import { getCalendarioAno } from "./calendarioAno.js";
import { addEventDay } from "../days.js";



let calendario = addEventDay();
console.log(calendario);

const renderCalender = (months) => {
    const divCalender = document.querySelector(".div-calender");
    divCalender.innerHTML = "";

    const tdPorData = {};
    const mes = months[11];

    const nameMonth = document.createElement("h3");
    nameMonth.textContent = mes.name;

    const table = document.createElement("table");
    table.className = "calendar-table";

    const thead = renderHeader();
    const tbody = document.createElement("tbody");

    let row = document.createElement("tr");

    mes.monthDay.forEach((dia, index) => {
        const td = document.createElement("td");

        if (dia !== "--") {
            td.textContent = dia.data.slice(-2);
            td.className = "day";
            td.style.position = "relative";
            tdPorData[dia.data] = td;
        }

        row.appendChild(td);

        if ((index + 1) % 7 === 0) {
            tbody.appendChild(row);
            row = document.createElement("tr");
        }
    });

    if (row.children.length > 0) tbody.appendChild(row);

    table.appendChild(thead);
    table.appendChild(tbody);

    const calendarContainer = document.createElement("div");
    calendarContainer.className = "calendar";
    calendarContainer.appendChild(nameMonth);
    calendarContainer.appendChild(table);
    divCalender.appendChild(calendarContainer);

    // Função auxiliar para tratar a data no fuso correto
    function parseDateLocal(dateString) {
        return new Date(dateString + 'T00:00:00');
    }

    // Limpa faixas anteriores antes de adicionar novas
    Object.values(tdPorData).forEach(td => {
        const wrappers = td.querySelectorAll(".event-wrapper");
        wrappers.forEach(w => w.remove());
    });

    // Adiciona evento
    mes.monthDay.forEach((dia) => {
        if (dia !== "--" && dia.evento?.length) {
            dia.evento.forEach((evento) => {
                const inicio = parseDateLocal(evento.dataInicio);
                const fim = parseDateLocal(evento.dataFim);
                let dataAtual = new Date(inicio);

                while (dataAtual <= fim) {
                    const dataStr = dataAtual.toISOString().split("T")[0];
                    const td = tdPorData[dataStr];

                    if (td) {
                        // Se ainda não existir, cria o wrapper e container de eventos
                        let wrapper = td.querySelector(".event-wrapper");
                        if (!wrapper) {
                            wrapper = document.createElement("div");
                            wrapper.className = "event-wrapper collapsed"; // começa collapsed

                            const container = document.createElement("div");
                            container.className = "event-container";
                            wrapper.appendChild(container);

                            td.appendChild(wrapper);
                        }

                        const container = wrapper.querySelector(".event-container");

                        // Evita duplicações visuais
                        const faixasExistentes = container.querySelectorAll(`.faixa-evento[data-event-id="${evento.id}"]`);
                        faixasExistentes.forEach(f => f.remove());

                        const faixa = document.createElement("div");
                        const textFaixa = document.createElement("p");

                        textFaixa.textContent = evento.descricao;
                        faixa.className = "faixa-evento";
                        faixa.dataset.eventId = evento.id;
                        faixa.style.backgroundColor = evento.cor;
                        faixa.title = evento.nome || "";
                        faixa.append(textFaixa);

                        container.appendChild(faixa);

                        // Após adicionar, verifica se passou de 3
                        const faixas = container.querySelectorAll(".faixa-evento");
                        let arrow = wrapper.querySelector(".expand-arrow");

                        if (faixas.length > 3) {
                            // Cria seta se não existir
                            if (!arrow) {
                                arrow = document.createElement("div");
                                arrow.className = "expand-arrow";
                                arrow.style.cursor = "pointer";

                                const updateArrowText = () => {
                                    if (wrapper.classList.contains("collapsed")) {
                                        arrow.textContent = `+${faixas.length - 3}`;
                                    } else {
                                        arrow.textContent = "Mostrar menos ▲";
                                    }
                                };

                                updateArrowText();

                                arrow.addEventListener("click", () => {
                                    const isCollapsed = wrapper.classList.contains("collapsed");

                                    if (isCollapsed) {
                                        wrapper.classList.remove("collapsed");
                                        wrapper.classList.add("expanded");
                                    } else {
                                        wrapper.classList.add("collapsed");
                                        wrapper.classList.remove("expanded");
                                    }

                                    updateArrowText();
                                });

                                wrapper.appendChild(arrow);
                            } else {
                                // Atualiza texto da seta
                                const updateArrowText = () => {
                                    if (wrapper.classList.contains("collapsed")) {
                                        arrow.textContent = `+${faixas.length - 3}`;
                                    } else {
                                        arrow.textContent = "Mostrar menos ▲";
                                    }
                                };
                                updateArrowText();
                            }
                        }
                    }

                    dataAtual.setDate(dataAtual.getDate() + 1);
                }
            });
        }
    });
};




const renderHeader = () => {
    const thead = document.createElement("thead");
    const row = document.createElement("tr");

    for (let i = 0; i < 7; i++) {
        const date = new Date(2024, 0, 7 + i); 
        const dia = date.toLocaleDateString("pt-BR", { weekday: "short" }).toUpperCase();

        const th = document.createElement("th");
        th.textContent = dia;
        th.className = "daysWeek";
        row.appendChild(th);
    }

    thead.appendChild(row);
    return thead;
};

function removerEventoPorId(calendario, idEvento) {
  return calendario.map(mes => {
    // Para cada mês, atualiza a lista de dias
    const monthDayAtualizado = mes.monthDay.map(dia => {
      if (dia === "--") return dia;
      // Remove o evento pelo id
      const eventosFiltrados = dia.evento.filter(ev => ev.id !== idEvento);
      return { ...dia, evento: eventosFiltrados };
    });

    return {
      ...mes,
      monthDay: monthDayAtualizado
    };
  });
}

const renderTableDescription = (eventMonth) => {
  const tbody = document.querySelector(".description-body");
  tbody.innerHTML = "";
  const buttonNewevent = document.querySelector(".add")
  // Cria um mapa para garantir unicidade dos eventos por id
  const eventosUnicos = new Map();

  eventMonth.forEach((e) => {
    if (!Array.isArray(e.evento) || e.evento.length === 0) return;

    e.evento.forEach((ev) => {
      if (!eventosUnicos.has(ev.id)) {
        eventosUnicos.set(ev.id, ev);
      }
    });
  });

  eventosUnicos.forEach((ev) => {
    const checkBox = document.createElement("input");
    const tr = document.createElement("tr");
    const day = document.createElement("td");
    const description = document.createElement("td");
    const deleteButton = document.createElement("button");
    const editDay = document.createElement('button')
    const addDay = document.createElement("button")

   

    checkBox.dataset.idCheckBox = ev.id;
    checkBox.className = "child";
    checkBox.type = "checkbox";

    day.textContent = formatarDias(ev.dataInicio, ev.dataFim);
    description.textContent = ev.descricao || "";
    deleteButton.textContent = "🗑️";
    editDay.textContent = "✏️"

    editDay.dataset.idEdit = ev.id

    buttonNewevent.addEventListener("click", () => {
      renderCalenderModal(null);
    })
    
    editDay.addEventListener("click", () => {
  const id = Number(editDay.dataset.idEdit);
  renderCalenderModal(id); // <--- usar o modal genérico!
});
   deleteButton.addEventListener("click", () => {
  const confirmDelete = confirm("Deseja excluir este evento?");
  if (!confirmDelete) return;

  calendario = removerEventoPorId(calendario, ev.id); // Atualiza o calendário global

  renderCalender(calendario);
   renderTablePreservandoEstado(calendario[11].monthDay);
});

    tr.append(checkBox, day, description,editDay, deleteButton);
    tbody.append(tr);
  });
};

function salvarEstadoCheckboxes() {
  const checkboxes = document.querySelectorAll('.child');
  const estado = {};

  checkboxes.forEach(cb => {
    estado[cb.dataset.idCheckBox] = cb.checked;
  });

  return estado;
}


export function processarEventosPorMes(calendario) {
  return calendario.map(mes => {
    const diasComEvento = mes.monthDay.filter(d => d !== "--" && Array.isArray(d.evento) && d.evento.length > 0);

    const eventosUnicos = [];
    const idsAdicionados = new Set();

    diasComEvento.forEach(dia => {
      dia.evento.forEach(ev => {
        if (!idsAdicionados.has(ev.id)) {
          eventosUnicos.push(ev);
          idsAdicionados.add(ev.id);
        }
      });
    });

    return {
      nomeMes: mes.name,
      evento: eventosUnicos
    };
  });
}

const handleSelectedEvent = () => {
    const selectAll = document.getElementById('selectAll');
    const children = document.querySelectorAll('.child');

    selectAll.checked = true;
    children.forEach(child => {
        child.checked = true;
        atualizarVisibilidadeEvento(child.dataset.idCheckBox, true);
    });
    selectAll.indeterminate = false;

    selectAll.addEventListener('change', () => {
        const isChecked = selectAll.checked;

        children.forEach(child => {
            child.checked = isChecked;
            atualizarVisibilidadeEvento(child.dataset.idCheckBox, isChecked);
        });

        selectAll.indeterminate = false;
    });

    children.forEach(child => {
        child.addEventListener('change', () => {
            const id = Number(child.dataset.idCheckBox);
            const isChecked = child.checked;

            atualizarVisibilidadeEvento(id, isChecked);

            const allChecked = Array.from(children).every(c => c.checked);
            const noneChecked = Array.from(children).every(c => !c.checked);

            if (allChecked) {
                selectAll.checked = true;
                selectAll.indeterminate = false;
            } else if (noneChecked) {
                selectAll.checked = false;
                selectAll.indeterminate = false;
            } else {
                selectAll.checked = false;
                selectAll.indeterminate = true;
            }
        });
    });

    function atualizarVisibilidadeEvento(id, isVisible) {
        const faixas = document.querySelectorAll(`.faixa-evento[data-event-id="${id}"]`);
        faixas.forEach(faixa => {
            faixa.classList.toggle("hidden-event", !isVisible);
        });
    }
};

function formatarDias(dataInicioStr, dataFimStr) {
    const dataInicio = new Date(dataInicioStr + "T12:00:00");
    const dataFim = new Date(dataFimStr + "T12:00:00");

    const diaInicio = dataInicio.getDate();
    const diaFim = dataFim.getDate();

    return diaInicio === diaFim ? String(diaInicio) : `${diaInicio} a ${diaFim}`;
}

function addNewEvent(calendario, eventoSemId) {
  // Função para buscar o maior ID atual no calendário
  const getMaxId = (cal) => {
    let maxId = 0;
    cal.forEach(mes => {
      mes.monthDay.forEach(dia => {
        if (dia !== "--" && Array.isArray(dia.evento)) {
          dia.evento.forEach(ev => {
            if (ev.id > maxId) maxId = ev.id;
          });
        }
      });
    });
    return maxId;
  };

  const novoId = getMaxId(calendario) + 1;

  const novoEvento = {
    id: novoId,
    ...eventoSemId
  };

  const parseDateLocal = (dateString) => new Date(dateString + 'T00:00:00');

  const inicio = parseDateLocal(novoEvento.dataInicio);
  const fim = parseDateLocal(novoEvento.dataFim);

  const calendarioAtualizado = calendario.map(mes => {
    const monthDayAtualizado = mes.monthDay.map(dia => {
      if (dia === "--") return dia;

      const diaData = new Date(dia.data + 'T00:00:00');

      if (diaData >= inicio && diaData <= fim) {
        const existeEvento = dia.evento.some(ev => ev.id === novoEvento.id);
        if (!existeEvento) {
          return {
            ...dia,
            evento: [...dia.evento, novoEvento]
          };
        }
      }

      return dia;
    });

    return {
      ...mes,
      monthDay: monthDayAtualizado
    };
  });

  return calendarioAtualizado;
}

function preencherFormularioComEvento(id, inputInicio, inputFim, inputDesc, inputCor) {
  for (const month of calendario) {
    for (const day of month.monthDay) {
      if (day !== "--" && day.evento?.length) {
        const ev = day.evento.find(e => e.id === id);

        if (ev) {
          inputInicio.value = ev.dataInicio || "";
          inputFim.value = ev.dataFim || ev.dataInicio || "";
          inputDesc.value = ev.descricao || "";
          inputCor.value = ev.cor || "#000000"; // valor padrão caso cor não exista
          return;
        }
      }
    }
  }
}

function renderCalenderModal(id = null) {
  const oldModal = document.getElementById("editCalendarModal");
  if (oldModal) oldModal.remove();

  const modal = document.createElement("div");
  modal.id = "editCalendarModal";

  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const form = document.createElement("form");

  // Campo: Data de início
  const labelInicio = document.createElement("label");
  labelInicio.textContent = "Data de início:";
  const inputInicio = document.createElement("input");
  inputInicio.type = "date";
  inputInicio.name = "dataInicio";
  if (id !== null) inputInicio.disabled = true; // só editável se for novo evento

  // Campo: Data final
  const labelFim = document.createElement("label");
  labelFim.textContent = "Data final:";
  const inputFim = document.createElement("input");
  inputFim.type = "date";
  inputFim.name = "dataFim";

  // 👉 Limita para dezembro de 2024
 if(id === null){
   limitarInputDatasParaDezembro(inputInicio, inputFim);
 }

  // Campo: Descrição
  const labelDesc = document.createElement("label");
  labelDesc.textContent = "Descrição:";
  const textareaDesc = document.createElement("textarea");
  textareaDesc.className = "input-description";
  textareaDesc.name = "descricao";
  textareaDesc.rows = 1;

  // Campo: Cor
  const labelCor = document.createElement("label");
  labelCor.textContent = "Cor:";
  const inputCor = document.createElement("input");
  inputCor.type = "color";
  inputCor.name = "cor";
  inputCor.value = "#000000"; // padrão

  // Botão de confirmar
  const btnConfirm = document.createElement("button");
  btnConfirm.type = "submit";
  btnConfirm.textContent = id !== null ? "Salvar alterações" : "Adicionar evento";

  // Monta o form
  const divColors = renderPreviousColors(inputCor)
  console.log(divColors);
  
  form.append(
    labelInicio, inputInicio,
    labelFim, inputFim,
    labelDesc, textareaDesc,
    labelCor, inputCor,
    divColors,
    btnConfirm
  );

  modalContent.appendChild(form);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Se for edição → preencher os campos
  if (id !== null) {
    preencherFormularioComEvento(id, inputInicio, inputFim, textareaDesc, inputCor);
    inputFim.min = inputInicio.value;
  }

  // Ajusta altura do textarea
  textareaDesc.addEventListener("input", (e) => {
    e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  });
  textareaDesc.dispatchEvent(new Event("input"));

  // Fecha modal ao clicar fora
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.remove();
  });

  // Submit → se for edição chama handleEdit, se for novo chama addNewEvent
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const newEvent = {
      dataInicio: inputInicio.value,
      dataFim: inputFim.value,
      descricao: textareaDesc.value.trim(),
      cor: inputCor.value
    };

    // Validação
    if (!newEvent.descricao) {
      alert("Descrição não pode ficar vazia.");
      return;
    }

    if (newEvent.dataFim < newEvent.dataInicio) {
      alert("A data final não pode ser anterior à data de início.");
      return;
    }

    if (id !== null) {
      // Edição
      handleEdit(id, event, modal, newEvent);
    } else {
      // Novo evento
      calendario = addNewEvent(calendario, newEvent);

      // Atualiza interface
      renderCalender(calendario);
      renderTablePreservandoEstado(calendario[11].monthDay);

      modal.remove();
    }
  });
}


function limitarInputDatasParaDezembro(inputInicio, inputFim) {
    inputInicio.min = "2024-12-01";
    inputInicio.max = "2024-12-31";
    inputFim.min = "2024-12-01";
    inputFim.max = "2024-12-31";

    // Atualiza inputFim.min quando dataInicio muda
    inputInicio.addEventListener("change", () => {
        inputFim.min = inputInicio.value;
        if (inputFim.value < inputInicio.value) {
            inputFim.value = inputInicio.value;
        }
    });
}


function handleEdit(id, event, modal, newEvent) {
  // Atualiza TODOS os eventos com o id no calendário
  for (const month of calendario) {
    for (const day of month.monthDay) {
      if (day !== "--" && day.evento?.length) {
        day.evento.forEach(ev => {
          if (ev.id === id) {
            ev.descricao = newEvent.descricao;
            ev.dataInicio = newEvent.dataInicio;
            ev.dataFim = newEvent.dataFim;
            ev.cor = newEvent.cor;
          }
        });
      }
    }
  }

  // Atualiza interface
  renderCalender(calendario);
  renderTablePreservandoEstado(calendario[11].monthDay);

  modal.remove();
}



function restaurarEstadoCheckboxes(estado) {
  const checkboxes = document.querySelectorAll('.child');
  checkboxes.forEach(cb => {
    if (estado.hasOwnProperty(cb.dataset.idCheckBox)) {
      cb.checked = estado[cb.dataset.idCheckBox];
    }
  });

  // Atualiza também o estado do selectAll:
  const selectAll = document.getElementById('selectAll');
  const children = document.querySelectorAll('.child');

  const allChecked = Array.from(children).every(c => c.checked);
  const noneChecked = Array.from(children).every(c => !c.checked);

  if (allChecked) {
    selectAll.checked = true;
    selectAll.indeterminate = false;
  } else if (noneChecked) {
    selectAll.checked = false;
    selectAll.indeterminate = false;
  } else {
    selectAll.checked = false;
    selectAll.indeterminate = true;
  }
}

function renderTablePreservandoEstado(eventMonth) {
  const estadoCheckboxes = salvarEstadoCheckboxes();

  renderTableDescription(eventMonth);
  handleSelectedEvent();
  restaurarEstadoCheckboxes(estadoCheckboxes);
}

function renderPreviousColors(inputCor) {
  const divColors = document.createElement("div");
  divColors.classList.add("previous-colors"); // para estilizar

  let colors = [];

  // Coletar TODAS as cores dos eventos do calendário
 calendario.forEach((mes) => {
    mes.monthDay.forEach((day) => {
      if (day !== "--" && day.evento?.length) {
        day.evento.forEach((ev) => {
          colors.push(ev.cor);
        });
      }
    });
  });

  // Remover duplicatas
  colors = [...new Set(colors)];

  console.log("Cores anteriores:", colors);

  // Criar quadradinhos clicáveis
  colors.forEach(color => {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("color-option");
    colorDiv.style.backgroundColor = color;
    colorDiv.dataset.color = color;

    // Quando clica em uma cor anterior, muda o inputCor
    colorDiv.addEventListener("click", () => {
      inputCor.value = color;
    });

    divColors.appendChild(colorDiv);
  });

  return divColors;
}

renderPreviousColors()


renderCalender(calendario);
renderTableDescription(calendario[11].monthDay);
handleSelectedEvent();

document.querySelector(".table-header").addEventListener("click", () => {
    const rowsWrapper = document.getElementById("tableRowsWrapper");
    const arrowIcon = document.querySelector(".arrow");

    rowsWrapper.classList.toggle("show");
    arrowIcon.classList.toggle("rotated");
});