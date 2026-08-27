// ============================================================
// UNICO ARQUIVO QUE FALA COM O BACKEND.
//
// Nenhuma tela usa fetch() diretamente. Todas usam api.get,
// api.post, api.put, api.patch ou api.remove daqui.
//
// Isso ja resolve 3 coisas para voce automaticamente:
//   1. monta a URL completa
//   2. manda o token do login no cabecalho
//   3. transforma erro do backend em mensagem legivel
//
// NAO E NECESSARIO ALTERAR ESTE ARQUIVO.
// ============================================================

// Se a porta 8080 estiver ocupada na sua maquina, troque aqui
// E no application.properties do backend. Tem que ser a MESMA.
export const URL_API = 'http://localhost:8080'

const CHAVE_TOKEN = 'bemdoar_token'

export function salvarToken(token) {
  localStorage.setItem(CHAVE_TOKEN, token)
}

export function lerToken() {
  return localStorage.getItem(CHAVE_TOKEN)
}

export function apagarToken() {
  localStorage.removeItem(CHAVE_TOKEN)
}

async function requisicao(metodo, caminho, corpo) {
  const cabecalhos = { 'Content-Type': 'application/json' }

  const token = lerToken()
  if (token) {
    cabecalhos['Authorization'] = 'Bearer ' + token
  }

  const resposta = await fetch(URL_API + caminho, {
    method: metodo,
    headers: cabecalhos,
    body: corpo ? JSON.stringify(corpo) : undefined
  })

  // 204 = deu certo e nao tem conteudo (ex: DELETE)
  if (resposta.status === 204) {
    return null
  }

  const texto = await resposta.text()
  const dados = texto ? JSON.parse(texto) : null

  if (!resposta.ok) {
    // O backend sempre devolve { mensagem: "..." } quando da erro.
    // Quando o erro e de validacao, vem tambem { campos: {...} }.
    let mensagem = (dados && dados.mensagem) || 'Nao foi possivel concluir a operacao.'
    if (dados && dados.campos) {
      mensagem = Object.values(dados.campos).join(' ')
    }
    if (resposta.status === 401) {
      apagarToken()
    }
    throw new Error(mensagem)
  }

  return dados
}

export const api = {
  get: (caminho) => requisicao('GET', caminho),
  post: (caminho, corpo) => requisicao('POST', caminho, corpo),
  put: (caminho, corpo) => requisicao('PUT', caminho, corpo),
  patch: (caminho, corpo) => requisicao('PATCH', caminho, corpo),
  remove: (caminho) => requisicao('DELETE', caminho)
}
