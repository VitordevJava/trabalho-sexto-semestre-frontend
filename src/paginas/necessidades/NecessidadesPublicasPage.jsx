import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../servicos/api'
import Icone from '../../componentes/Icone'

function classeSituacao(situacao) {
  return situacao === 'ATENDIDA' ? 'verde' : situacao === 'ENCERRADA' ? 'cinza' : 'amarela'
}

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
      Object.entries(filtrosAtuais).forEach(([chave, valor]) => valor && parametros.set(chave, valor))
      parametros.set('pagina', numeroPagina)
      setPagina(await api.get('/api/necessidades?' + parametros.toString()))
    } catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  function aoFiltrar(evento) {
    const novos = { ...filtros, [evento.target.name]: evento.target.value }
    setFiltros(novos)
    carregar(0, novos)
  }

  function limparFiltros() {
    const vazios = { termo: '', categoriaId: '', prioridade: '', situacao: '' }
    setFiltros(vazios)
    carregar(0, vazios)
  }

  return <section className="pagina-necessidades">
    <header className="cabecalho-pagina"><div><p className="sobrelinha">Onde sua ajuda faz diferenca</p><h1>Necessidades ativas</h1><p>Escolha uma causa, veja a meta e registre sua doacao.</p></div><div className="resumo-causas"><strong>{pagina.content.length}</strong><span>causas nesta pagina</span></div></header>
    <div className="filtros-novos">
      <label className="busca"><Icone nome="filtro" tamanho={19}/><input aria-label="Buscar necessidades" name="termo" value={filtros.termo} onChange={aoFiltrar} placeholder="Buscar por item ou descricao" /></label>
      <select aria-label="Categoria" name="categoriaId" value={filtros.categoriaId} onChange={aoFiltrar}><option value="">Todas as categorias</option>{categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}</select>
      <select aria-label="Prioridade" name="prioridade" value={filtros.prioridade} onChange={aoFiltrar}><option value="">Todas as prioridades</option><option value="ALTA">Alta prioridade</option><option value="MEDIA">Media prioridade</option><option value="BAIXA">Baixa prioridade</option></select>
      {(filtros.termo || filtros.categoriaId || filtros.prioridade || filtros.situacao) && <button className="botao-link" onClick={limparFiltros}>Limpar</button>}
    </div>
    {erro && <div className="alerta erro" role="alert">{erro}</div>}
    {carregando ? <div className="grade-necessidades">{[1,2,3].map(i => <div className="cartao-necessidade skeleton" key={i}/>)}</div> : pagina.content.length === 0 ? <div className="estado-vazio"><Icone nome="caixa" tamanho={36}/><h2>Nenhuma necessidade encontrada</h2><p>Tente remover os filtros ou buscar outro termo.</p><button className="botao secundario" onClick={limparFiltros}>Limpar filtros</button></div> :
      <div className="grade-necessidades">{pagina.content.map(n => <article className="cartao-necessidade" key={n.id}>
        <div className="cartao-necessidade-topo"><span className={`etiqueta ${classeSituacao(n.situacao)}`}>{n.situacao.replaceAll('_',' ')}</span><span className={`prioridade prioridade-${n.prioridade.toLowerCase()}`}>{n.prioridade}</span></div>
        <div className="icone-categoria"><Icone nome={n.categoriaNome.toLowerCase().includes('roup') ? 'coracao' : 'caixa'} tamanho={30}/></div>
        <p className="categoria">{n.categoriaNome}</p><h2>{n.titulo}</h2><p className="descricao">{n.descricao}</p>
        <div className="meta-progresso"><div><span>Recebido</span><strong>{n.quantidadeRecebida}</strong></div><div><span>Meta</span><strong>{n.quantidadeNecessaria}</strong></div></div>
        <div className="barra-progresso" aria-label={`${n.percentual}% da meta`}><i style={{width: Math.min(n.percentual,100)+'%'}} /></div><small>{n.percentual}% alcancado</small>
        <Link className="botao primario botao-bloco" to={`/necessidades/${n.id}`}>Ver detalhes</Link>
      </article>)}</div>}
    {pagina.totalPages > 1 && <nav className="paginacao" aria-label="Paginacao"><button className="botao secundario" disabled={pagina.number === 0} onClick={() => carregar(pagina.number - 1)}>Anterior</button><span>{pagina.number + 1} de {pagina.totalPages}</span><button className="botao secundario" disabled={pagina.number + 1 >= pagina.totalPages} onClick={() => carregar(pagina.number + 1)}>Proxima</button></nav>}
  </section>
}
