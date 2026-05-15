(function () {
  function normalizeQuestions(questions) {
    if (!Array.isArray(questions)) return [];
    return questions.map(function (question, index) {
      return {
        id: question.id || 'q-' + (index + 1),
        text: question.text || ('Pregunta ' + (index + 1)),
        options: Array.isArray(question.options) ? question.options : [],
        correctIndex: Number.isInteger(question.correctIndex) ? question.correctIndex : 0,
        explanation: question.explanation || 'Explicación no disponible.'
      };
    });
  }

  function uniqueOptions(correct, wrong) {
    var options = [correct].concat(wrong || []);
    var seen = {};
    var clean = [];
    options.forEach(function (opt) {
      if (typeof opt !== 'string') return;
      if (seen[opt]) return;
      seen[opt] = true;
      clean.push(opt);
    });
    while (clean.length < 4) {
      clean.push('Ninguna de las anteriores en este contexto');
    }
    return clean.slice(0, 4);
  }

  function createSeedQuestions(config) {
    var themes = Array.isArray(config && config.themes) && config.themes.length ? config.themes : ['temario del tomo'];
    var tomoTitle = (config && config.title) || 'tomo';
    var count = Number(config && config.count) || 100;
    if (count < 100) count = 100;
    if (count > 350) count = 350;

    var patterns = [
      function (theme) {
        var correct = 'Aplicar una revisión sistemática de ' + theme + ' siguiendo seguridad, diagnóstico y verificación final';
        var wrong = [
          'Actuar sin checklist técnico y sin registrar resultados',
          'Sustituir componentes sin comprobar causa raíz',
          'Ignorar pruebas funcionales antes de cerrar intervención'
        ];
        return {
          text: 'En ' + tomoTitle + ', ¿cuál es el enfoque más sólido para trabajar ' + theme + '?',
          correct: correct,
          wrong: wrong,
          explanation: 'El enfoque correcto combina método, seguridad y validación final para evitar errores recurrentes en ' + theme + '.'
        };
      },
      function (theme) {
        var correct = 'Verificar síntomas, hipótesis, medida y contraste antes de decidir intervención en ' + theme;
        var wrong = [
          'Confiar solo en una impresión inicial sin medir',
          'Corregir primero y diagnosticar después',
          'Descartar documentación técnica del sistema'
        ];
        return {
          text: 'Ante una incidencia relacionada con ' + theme + ', ¿qué secuencia mejora el diagnóstico?',
          correct: correct,
          wrong: wrong,
          explanation: 'Diagnosticar por fases reduce fallos de interpretación y evita sustituciones innecesarias.'
        };
      },
      function (theme) {
        var correct = 'Comprobar estado inicial, condiciones de operación y criterios de aceptación de ' + theme;
        var wrong = [
          'Realizar ajustes sin referencia al estado inicial',
          'Dar por válida la reparación sin pruebas de carga',
          'Priorizar velocidad sobre trazabilidad técnica'
        ];
        return {
          text: '¿Qué debe quedar documentado al intervenir sobre ' + theme + '?',
          correct: correct,
          wrong: wrong,
          explanation: 'Registrar estado inicial y validación final permite trazabilidad y mejora continua.'
        };
      },
      function (theme) {
        var correct = 'Asegurar aislamiento de riesgos y comunicación operativa antes de manipular ' + theme;
        var wrong = [
          'Manipular sin consignación cuando el tiempo es limitado',
          'Trabajar en solitario sin informar al equipo',
          'Saltar señalización de seguridad por rutina'
        ];
        return {
          text: 'Respecto a seguridad en ' + theme + ', ¿qué práctica es imprescindible?',
          correct: correct,
          wrong: wrong,
          explanation: 'La seguridad operacional requiere consignación, coordinación y control de riesgos en todo momento.'
        };
      },
      function (theme) {
        var correct = 'Correlacionar datos de prueba con comportamiento observado de ' + theme;
        var wrong = [
          'Elegir la causa por la avería más frecuente sin evidencias',
          'Cambiar el elemento más accesible sin contraste',
          'Cerrar incidencia si el fallo no aparece al primer intento'
        ];
        return {
          text: '¿Cómo se evita un falso positivo al evaluar ' + theme + '?',
          correct: correct,
          wrong: wrong,
          explanation: 'Relacionar medidas y síntomas evita confirmar hipótesis erróneas.'
        };
      },
      function (theme) {
        var correct = 'Realizar prueba funcional completa y criterios de aceptación específicos de ' + theme;
        var wrong = [
          'Finalizar al desaparecer un síntoma puntual',
          'Aceptar la reparación sin escenario exigente',
          'Posponer validación para una revisión futura'
        ];
        return {
          text: 'Tras una corrección en ' + theme + ', ¿qué confirma que el trabajo está bien cerrado?',
          correct: correct,
          wrong: wrong,
          explanation: 'La prueba funcional completa valida la solución en condiciones representativas.'
        };
      },
      function (theme) {
        var correct = 'Comparar parámetros nominales y reales de ' + theme + ' para detectar desviaciones';
        var wrong = [
          'Evaluar solo por sensación subjetiva del operador',
          'Sustituir piezas por antigüedad sin diagnóstico',
          'Interpretar cualquier ruido como fallo crítico'
        ];
        return {
          text: '¿Qué criterio técnico aporta mayor fiabilidad al analizar ' + theme + '?',
          correct: correct,
          wrong: wrong,
          explanation: 'La comparación nominal/real aporta criterio objetivo para decidir acciones.'
        };
      },
      function (theme) {
        var correct = 'Priorizar continuidad segura del servicio sin ocultar incidencias en ' + theme;
        var wrong = [
          'Ocultar anomalías para evitar retrasos',
          'Forzar operación fuera de límites previstos',
          'Ignorar incidencias intermitentes por baja frecuencia'
        ];
        return {
          text: 'En operación y mantenimiento de ' + theme + ', ¿qué principio debe prevalecer?',
          correct: correct,
          wrong: wrong,
          explanation: 'La continuidad de servicio siempre debe mantenerse bajo márgenes de seguridad y transparencia técnica.'
        };
      }
    ];

    var questions = [];
    for (var i = 0; i < count; i += 1) {
      var theme = themes[i % themes.length];
      var pattern = patterns[i % patterns.length];
      var payload = pattern(theme);
      var options = uniqueOptions(payload.correct, payload.wrong);
      var correctIndex = options.indexOf(payload.correct);
      if (correctIndex < 0) {
        options[0] = payload.correct;
        correctIndex = 0;
      }
      questions.push({
        id: 'q-' + (i + 1),
        text: payload.text,
        options: options,
        correctIndex: correctIndex,
        explanation: payload.explanation
      });
    }
    return questions;
  }

  function renderIndex() {
    var grid = document.getElementById('tomos-grid');
    if (!grid || !Array.isArray(window.TOMOS)) return;
    grid.innerHTML = '';

    window.TOMOS.forEach(function (tomo) {
      var card = document.createElement('article');
      card.className = 'card';

      var badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = tomo.badge || 'Tomo';

      var title = document.createElement('h2');
      title.textContent = tomo.title;

      var desc = document.createElement('p');
      desc.className = 'meta';
      desc.textContent = tomo.description || '';

      var count = document.createElement('p');
      count.className = 'meta';
      count.innerHTML = '<strong>Preguntas:</strong> ' + (tomo.questionCount || 0);

      var action = document.createElement('a');
      action.className = 'button primary';
      action.href = tomo.file;
      action.textContent = 'Abrir test';

      card.appendChild(badge);
      card.appendChild(title);
      card.appendChild(desc);
      card.appendChild(count);
      card.appendChild(action);
      grid.appendChild(card);
    });
  }

  function initTomoPage() {
    if (!window.TOMO_DATA) return;

    var sourceQuestions = normalizeQuestions(window.TOMO_DATA.questions);
    var state = {
      title: window.TOMO_DATA.title || 'Test por tomo',
      tomoId: window.TOMO_DATA.tomoId || 'tomo',
      description: window.TOMO_DATA.description || '',
      baseQuestions: sourceQuestions,
      activeQuestions: sourceQuestions.slice(),
      index: 0,
      answers: sourceQuestions.map(function () { return null; }),
      revealed: sourceQuestions.map(function () { return false; })
    };

    var titleEl = document.getElementById('test-title');
    var descriptionEl = document.getElementById('test-description');
    var tomoEl = document.getElementById('status-tomo');
    var questionEl = document.getElementById('status-question');
    var answeredEl = document.getElementById('status-answered');
    var qTextEl = document.getElementById('question-text');
    var optionsEl = document.getElementById('options');
    var feedbackEl = document.getElementById('feedback');
    var prevButton = document.getElementById('prev-button');
    var nextButton = document.getElementById('next-button');
    var revealButton = document.getElementById('reveal-button');
    var finishButton = document.getElementById('finish-button');
    var repeatFailedButton = document.getElementById('repeat-failed-button');

    var results = document.getElementById('results');
    var scoreEl = document.getElementById('score');
    var hitsEl = document.getElementById('hits');
    var errorsEl = document.getElementById('errors');
    var blankEl = document.getElementById('blank');

    titleEl.textContent = state.title;
    descriptionEl.textContent = state.description;

    function renderQuestion() {
      var question = state.activeQuestions[state.index];
      if (!question) return;

      tomoEl.textContent = state.tomoId;
      questionEl.textContent = (state.index + 1) + ' / ' + state.activeQuestions.length;
      var answeredCount = state.answers.filter(function (a) { return a !== null && a !== undefined; }).length;
      answeredEl.textContent = String(answeredCount);
      qTextEl.textContent = question.text;

      optionsEl.innerHTML = '';
      question.options.forEach(function (optionText, optionIndex) {
        var label = document.createElement('label');
        label.className = 'option';

        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'answer';
        input.value = String(optionIndex);
        input.checked = state.answers[state.index] === optionIndex;

        input.addEventListener('change', function () {
          state.answers[state.index] = optionIndex;
          state.revealed[state.index] = false;
          renderQuestion();
        });

        var text = document.createElement('span');
        text.textContent = optionText;
        label.appendChild(input);
        label.appendChild(text);

        if (state.revealed[state.index]) {
          if (optionIndex === question.correctIndex) label.classList.add('correct');
          var selected = state.answers[state.index];
          if (selected === optionIndex && selected !== question.correctIndex) {
            label.classList.add('incorrect');
          }
        }

        optionsEl.appendChild(label);
      });

      feedbackEl.className = 'feedback';
      feedbackEl.innerHTML = '';
      if (state.revealed[state.index]) {
        var selected = state.answers[state.index];
        if (selected === null || selected === undefined) {
          feedbackEl.classList.add('visible', 'warning');
          feedbackEl.innerHTML = '<strong>No has seleccionado respuesta.</strong><br>La correcta es <strong>' +
            question.options[question.correctIndex] + '</strong>.<br><br><strong>Explicación:</strong> ' + question.explanation;
        } else if (selected === question.correctIndex) {
          feedbackEl.classList.add('visible', 'correct');
          feedbackEl.innerHTML = '<strong>Respuesta correcta.</strong><br>Has elegido la opción válida.<br><br><strong>Explicación:</strong> ' + question.explanation;
        } else {
          feedbackEl.classList.add('visible', 'incorrect');
          feedbackEl.innerHTML = '<strong>Respuesta incorrecta.</strong><br>Tu elección fue <strong>' +
            question.options[selected] + '</strong>, la correcta es <strong>' +
            question.options[question.correctIndex] + '</strong>.<br><br><strong>Explicación:</strong> ' + question.explanation;
        }
      }

      prevButton.disabled = state.index === 0;
      nextButton.disabled = state.index === state.activeQuestions.length - 1;
    }

    function finishTest() {
      var total = state.activeQuestions.length;
      var correct = 0;
      var wrong = 0;
      var blank = 0;
      var failedQuestions = [];

      state.activeQuestions.forEach(function (question, idx) {
        var answer = state.answers[idx];
        if (answer === null || answer === undefined) {
          blank += 1;
          failedQuestions.push(question);
        } else if (answer === question.correctIndex) {
          correct += 1;
        } else {
          wrong += 1;
          failedQuestions.push(question);
        }
      });

      var percent = total ? Math.round((correct / total) * 100) : 0;
      scoreEl.textContent = percent + '%';
      hitsEl.textContent = String(correct);
      errorsEl.textContent = String(wrong);
      blankEl.textContent = String(blank);
      results.classList.add('visible');

      repeatFailedButton.disabled = failedQuestions.length === 0;
      repeatFailedButton.onclick = function () {
        if (!failedQuestions.length) return;
        state.activeQuestions = failedQuestions.slice();
        state.answers = state.activeQuestions.map(function () { return null; });
        state.revealed = state.activeQuestions.map(function () { return false; });
        state.index = 0;
        results.classList.remove('visible');
        renderQuestion();
      };

      results.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    prevButton.addEventListener('click', function () {
      if (state.index > 0) {
        state.index -= 1;
        renderQuestion();
      }
    });

    nextButton.addEventListener('click', function () {
      if (state.index < state.activeQuestions.length - 1) {
        state.index += 1;
        renderQuestion();
      }
    });

    revealButton.addEventListener('click', function () {
      state.revealed[state.index] = true;
      renderQuestion();
    });

    finishButton.addEventListener('click', finishTest);

    renderQuestion();
  }

  window.createSeedQuestions = createSeedQuestions;

  document.addEventListener('DOMContentLoaded', function () {
    renderIndex();
    initTomoPage();
  });
})();
