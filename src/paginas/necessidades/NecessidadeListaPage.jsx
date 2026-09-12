import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../servicos/api'

/** RF07/RF09 - listagem administrativa: editar, encerrar, excluir. */
export default function NecessidadeListaPage() {
  const [pagina, setPagina] = useState({ content: [], totalPages: 0, number: 0 })
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  async function carregar(numeroPagina = 0) {
    setCarregando(true)
    setErro('')
    try {
      setPagina(await api.get('/api/necessidades?pagina=' + numeroPagina))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  useEffect(() => { carregar(0) }, [])

  async function encerrar(necessidade) {
    if (!window.confirm(`Encerrar "${necessidade.titulo}"? Isso bloqueia novas doacoes e nao pode ser desfeito.`)) return
    setErro(''); setAviso('')
    try {
      await api.patch(`/api/necessidades/${necessidade.id}/encerrar`)
      setAviso('Necessidade encerrada com sucesso.')
      carregar(pagina.number)
    } catch (e) { setErro(e.message) }
  }

  async function excluir(necessidade) {
    if (!window.confirm(`Excluir "${necessidade.titulo}" definitivamente?`)) return
    setErro(''); setAviso('')
    try {
      await api.remove(`/api/necessidades/${necessidade.id}`)
      setAviso('Necessidade excluida.')
      carregar(pagina.number)
    } catch (e) { setErro(e.message) }
  }

  return (
    <div>
      <div className="titulo-pagina">
        <h1>Gerir necessidades</h1>
        <Link className="botao primario" to="/admin/necessidades/nova">Nova necessidade</Link>
      </div>

      {erro && <div className="alerta erro">{erro}</div>}
      {aviso && <div className="alerta ok">{aviso}</div>}

      <div className="cartao">
        {carregando ? (
          <div className="vazio">Carregando...</div>
        ) : pagina.content.length === 0 ? (
          <div className="vazio">Nenhuma necessidade cadastrada.</div>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Titulo</th><th>Categoria</th><th>Prioridade</th>
                <th>Recebido</th><th>Situacao</th><th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((n) => (
                <tr key={n.id}>
                  <td>{n.titulo}</td>
                  <td>{n.categoriaNome}</td>
                  <td>{n.prioridade}</td>
                  <td>{n.quantidadeRecebida} / {n.quantidadeNecessaria}</td>
                  <td><span className="etiqueta">{n.situacao}</span></td>
                  <td className="acoes">
                    <Link className="botao pequeno" to={`/admin/necessidades/${n.id}`}>Editar</Link>
                    <button className="botao pequeno" onClick={() => encerrar(n)}>Encerrar</button>
                    <button className="botao pequeno perigo" onClick={() => excluir(n)}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagina.totalPages > 1 && (
        <div className="acoes-form">
          <button className="botao" disabled={pagina.number === 0}
                  onClick={() => carregar(pagina.number - 1)}>Anterior</button>
          <span style={{ alignSelf: 'center', fontSize: '14px' }}>
            Pagina {pagina.number + 1} de {pagina.totalPages}
          </span>
          <button className="botao" disabled={pagina.number + 1 >= pagina.totalPages}
                  onClick={() => carregar(pagina.number + 1)}>Proxima</button>
        </div>
      )}
    </div>
  )
}
