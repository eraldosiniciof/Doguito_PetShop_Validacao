export function valida(input) {
  const tipoDeInput = input.dataset.tipo;

  if (validadores[tipoDeInput]) {
    validadores[tipoDeInput](input);
  }

  if (input.validity.valid) {
    input.parentElement.classList.remove("input-container--invalido");
    input.parentElement.querySelector(".input-mensagem-erro").innerHTML = "";
  } else {
    input.parentElement.classList.add("input-container--invalido");
    input.parentElement.querySelector(".input-mensagem-erro").innerHTML =
      mostraMensagemDeErro(tipoDeInput, input);
  }
}

const tiposDeErro = [
  "valueMissing",
  "typeMismatch",
  "patternMismatch",
  "customError",
];

const mensagensDeErro = {
  nome: {
    valueMissing: "O campo de nome não pode estar vazio.",
  },
  email: {
    valueMissing: "O campo de email não pode estar vazio.",
    typeMismatch: "O email digitado não é válido.",
  },
  senha: {
    valueMissing: "O campo de senha não pode estar vazio.",
    patternMismatch:
      "A senha deve conter entre 6 a 12 caracteres, deve conter pelo menos uma letra maiúscula, um número e não deve conter símbolos.",
  },
  dataNascimento: {
    valueMissing: "O campo de data de nascimento não pode estar vazio.",
    customError: "Você deve ser maior que 18 anos para se cadastrar.",
  },
  cpf: {
    valueMissing: "O campo de CPF não pode estar vazio",
    customError: "O CPF digitado não é válido.",
  },
};

function validaDataNascimento(input) {
  const hoje = new Date().getUTCFullYear();
  const dataRecebida = new Date(input.value).getUTCFullYear();
  const maiorQue18 = hoje - dataRecebida > 18;
  let mensagem = "";

  if (!maiorQue18) {
    mensagem = "Você deve ser maior que 18 anos para se cadastrar.";
  }

  input.setCustomValidity(mensagem);
}

const validadores = {
  dataNascimento: (input) => validaDataNascimento(input),
  cpf: (input) => validaCPF(input),
};

function mostraMensagemDeErro(tipoDeInput, input) {
  let mensagem = "";
  tiposDeErro.forEach((erro) => {
    if (input.validity[erro]) {
      mensagem = mensagensDeErro[tipoDeInput][erro];
    }
  });
  return mensagem;
}

function checaCPFRepetido(cpf) {
  const valoresRepetidos = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];
  let cpfValido = true;

  valoresRepetidos.forEach((valor) => {
    if (valor == cpf) {
      cpfValido = false;
    }
  });

  return cpfValido;
}

function checaEstruturaCPF(cpf) {
  const multiplicador = 10;

  return checaDigitoVerificador(cpf, multiplicador);
}

function validaCPF(input) {
  const cpfFormatado = input.value.replace(/\D/g, "");
  let mensagem = "";

  const repetido = checaCPFRepetido(cpfFormatado);
  const estruturado = checaEstruturaCPF(cpfFormatado);

  if (!repetido || !estruturado) {
    mensagem = "O CPF digitado não é válido.";
  }

  input.setCustomValidity(mensagem);
}

function checaDigitoVerificador(cpf, multiplicador) {
  if (multiplicador >= 12) {
    return true;
  }

  let multiplicadorInicial = multiplicador;
  let soma = 0;
  const cpfSemDigitos = cpf.substr(0, multiplicador - 1).split("");
  const digitoVerificador = cpf.charAt(multiplicador - 1);

  for (let contador = 0; multiplicadorInicial > 1; multiplicadorInicial--) {
    soma = soma + cpfSemDigitos[contador] * multiplicadorInicial;
    contador++;
  }

  function confirmaDigito(soma) {
    return 11 - (soma % 11);
  }

  if (digitoVerificador == confirmaDigito(soma)) {
    return checaDigitoVerificador(cpf, multiplicador + 1);
  }

  return false;
}

// // 123 456 789 09

// // let soma = (11 * 1) + (10 * 2) + (9 * 3) ... (2 * 0)

// // let digitoVerificador = 11 - (soma % 11)
