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
export const URL_API = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')

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

  let resposta
  try {
    resposta = await fetch(URL_API + caminho, {
      method: metodo,
      headers: cabecalhos,
      body: corpo === undefined ? undefined : JSON.stringify(corpo)
    })
  } catch {
    throw new Error('Nao foi possivel conectar ao servidor. Verifique se o backend esta em execucao.')
  }

  // 204 = deu certo e nao tem conteudo (ex: DELETE)
  if (resposta.status === 204) {
    return null
  }

  const dados = await lerResposta(resposta)

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

async function lerResposta(resposta) {
  const texto = await resposta.text()
  if (!texto) return null

  try {
    return JSON.parse(texto)
  } catch {
    if (!resposta.ok) {
      return { mensagem: `O servidor respondeu com erro ${resposta.status}.` }
    }
    throw new Error('O servidor devolveu uma resposta invalida.')
  }
}

export const api = {
  get: (caminho) => requisicao('GET', caminho),
  post: (caminho, corpo) => requisicao('POST', caminho, corpo),
  put: (caminho, corpo) => requisicao('PUT', caminho, corpo),
  patch: (caminho, corpo) => requisicao('PATCH', caminho, corpo),
  remove: (caminho) => requisicao('DELETE', caminho),
  upload: async (caminho, arquivo) => {
    if (!arquivo) throw new Error('Selecione um arquivo para enviar.')
    const dados = new FormData()
    dados.append('arquivo', arquivo)
    const cabecalhos = {}
    const token = lerToken()
    if (token) cabecalhos.Authorization = 'Bearer ' + token
    let resposta
    try {
      resposta = await fetch(URL_API + caminho, { method: 'POST', headers: cabecalhos, body: dados })
    } catch {
      throw new Error('Nao foi possivel conectar ao servidor. Verifique se o backend esta em execucao.')
    }
    const retorno = await lerResposta(resposta)
    if (resposta.status === 401) apagarToken()
    if (!resposta.ok) throw new Error(retorno?.mensagem || 'Nao foi possivel enviar o arquivo.')
    return retorno
  }
}
