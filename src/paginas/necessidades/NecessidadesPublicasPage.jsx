import { useEffect, useState } from 'react'
import { api } from '../../servicos/api'
import { Link } from 'react-router-dom'

/**
 * RF07 - lista publica com busca e filtros. Nao exige login.
 * Serve de exemplo de tela publica com filtros para as outras frentes.
 */
export default function NecessidadesPublicasPage() {
  const [pagina, setPagina] = useState({ content: [], totalPages: 0, number: 0 })
  const [categorias, setCategorias] = useState([])
  const [filtros, setFiltros] = useState({ termo: '', categoriaId: '', prioridade: '', situacao: '' })
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api.get('/api/categorias/ativas').then(setCategorias).catch(() => {})
    carregar(0)
  }, [])

  async function carregar(numeroPagina, filtrosAtuais = filtros) {
    setCarregando(true)
    setErro('')
    try {
      const parametros = new URLSearchParams()
      if (filtrosAtuais.termo) parametros.set('termo', filtrosAtuais.termo)
      if (filtrosAtuais.categoriaId) parametros.set('categoriaId', filtrosAtuais.categoriaId)
      if (filtrosAtuais.prioridade) parametros.set('prioridade', filtrosAtuais.prioridade)
      if (filtrosAtuais.situacao) parametros.set('situacao', filtrosAtuais.situacao)
      parametros.set('pagina', numeroPagina)

      setPagina(await api.get('/api/necessidades?' + parametros.toString()))
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  function aoFiltrar(evento) {
    const { name, value } = evento.target
    const novos = { ...filtros, [name]: value }
    setFiltros(novos)
    carregar(0, novos)
  }

  return (
    <div>
      <div className="titulo-pagina"><h1>Necessidades</h1></div>

      <div className="filtros">
        <div className="campo">
          <label>Buscar</label>
          <input name="termo" value={filtros.termo} onChange={aoFiltrar} placeholder="titulo ou descricao" />
        </div>
        <div className="campo">
          <label>Categoria</label>
          <select name="categoriaId" value={filtros.categoriaId} onChange={aoFiltrar}>
            <option value="">Todas</option>
            {categorias.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
        <div className="campo">
          <label>Prioridade</label>
          <select name="prioridade" value={filtros.prioridade} onChange={aoFiltrar}>
            <option value="">Todas</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Media</option>
            <option value="BAIXA">Baixa</option>
          </select>
        </div>
        <div className="campo">
          <label>Situacao</label>
          <select name="situacao" value={filtros.situacao} onChange={aoFiltrar}>
            <option value="">Todas</option>
            <option value="ABERTA">Aberta</option>
            <option value="PARCIALMENTE_ATENDIDA">Parcialmente atendida</option>
            <option value="ATENDIDA">Atendida</option>
            <option value="ENCERRADA">Encerrada</option>
          </select>
        </div>
      </div>

      {erro && <div className="alerta erro">{erro}</div>}

      <div className="cartao">
        {carregando ? (
          <div className="vazio">Carregando...</div>
        ) : pagina.content.length === 0 ? (
          <div className="vazio">Nenhuma necessidade encontrada.</div>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Titulo</th><th>Categoria</th><th>Prioridade</th>
                <th>Progresso</th><th>Situacao</th><th></th>
              </tr>
            </thead>
            <tbody>
              {pagina.content.map((n) => (
                <tr key={n.id}>
                  <td>{n.titulo}</td>
                  <td>{n.categoriaNome}</td>
                  <td>{n.prioridade}</td>
                  <td>
                    <div className="progresso">
                      <div style={{ width: Math.min(n.percentual, 100) + '%' }} />
                    </div>
                    <small>{n.quantidadeRecebida} / {n.quantidadeNecessaria} ({n.percentual}%)</small>
                  </td>
                  <td><span className="etiqueta">{n.situacao}</span></td>
                  <td>{n.situacao !== 'ENCERRADA' && <Link className="botao primario" to={`/doar/necessidade/${n.id}`}>Doar</Link>}</td>
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
