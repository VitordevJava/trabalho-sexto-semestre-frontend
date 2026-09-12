import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../servicos/api'

const inicial = { titulo: '', descricao: '', objetivo: '', imagemUrl: '', dataInicio: '', dataFim: '', metaMinima: 1 }

export function CampanhaListaPage({ admin = false }) {
  const [itens, setItens] = useState([]), [erro, setErro] = useState(''), [carregando, setCarregando] = useState(true)
  const carregar = () => { setCarregando(true); return api.get('/api/campanhas').then(setItens).catch(e => setErro(e.message)).finally(() => setCarregando(false)) }
  useEffect(() => { carregar() }, [])
  async function agir(item, acao) {
    if (!window.confirm(`Deseja realmente ${acao} a campanha "${item.titulo}"?`)) return
    let corpo
    if (acao === 'cancelar') { const motivo = window.prompt('Informe o motivo do cancelamento:'); if (!motivo) return; corpo = { motivo } }
    try { await api.patch(`/api/campanhas/${item.id}/${acao}`, corpo); await carregar() } catch (e) { setErro(e.message) }
  }
  return <section><div className="titulo-pagina"><h1>{admin ? 'Gerir campanhas' : 'Campanhas'}</h1>{admin && <Link className="botao primario" to="/admin/campanhas/nova">Nova campanha</Link>}</div>
    {erro && <p className="alerta erro">{erro}</p>}{carregando ? <div className="vazio">Carregando campanhas...</div> : itens.length === 0 ? <div className="vazio">Nenhuma campanha disponivel.</div> :
      <div className="grade-cartoes">{itens.map(x => <article className="cartao" key={x.id}><h2>{x.titulo}</h2><p>{x.descricao}</p><p><span className="etiqueta">{x.situacao}</span></p><p>Progresso: {x.percentual}% ({x.recebido}/{x.metaMinima})</p>
        {admin ? <div className="acoes-form"><Link className="botao" to={`/admin/campanhas/${x.id}`}>Editar</Link><Link className="botao" to={`/admin/campanhas/${x.id}/necessidades`}>Necessidades</Link>{x.situacao === 'PLANEJADA' && <button className="botao primario" onClick={() => agir(x, 'ativar')}>Ativar</button>}{['PLANEJADA','ATIVA'].includes(x.situacao) && <button className="botao" onClick={() => agir(x, 'encerrar')}>Encerrar</button>}{['PLANEJADA','ATIVA'].includes(x.situacao) && <button className="botao perigo" onClick={() => agir(x, 'cancelar')}>Cancelar</button>}</div>
          : <Link className="botao primario" to={`/campanhas/${x.id}`}>Ver campanha</Link>}</article>)}</div>}
  </section>
}

export function CampanhaFormPage() {
  const { id } = useParams(), navegar = useNavigate(), [form, setForm] = useState(inicial), [erro, setErro] = useState(''), [salvando, setSalvando] = useState(false)
  useEffect(() => { if (id) api.get(`/api/campanhas/${id}`).then(setForm).catch(e => setErro(e.message)) }, [id])
  async function salvar(e) { e.preventDefault(); setSalvando(true); try { const corpo = { ...form, metaMinima: Number(form.metaMinima) }; id ? await api.put(`/api/campanhas/${id}`, corpo) : await api.post('/api/campanhas', corpo); navegar('/admin/campanhas') } catch (e) { setErro(e.message) } finally { setSalvando(false) } }
  return <section><h1>{id ? 'Editar' : 'Nova'} campanha</h1>{erro && <p className="alerta erro">{erro}</p>}<form className="cartao" onSubmit={salvar}>
    {[['titulo','Titulo','text'],['descricao','Descricao','textarea'],['objetivo','Objetivo','textarea'],['imagemUrl','URL da imagem','url'],['dataInicio','Data inicial','date'],['dataFim','Data final','date'],['metaMinima','Meta minima','number']].map(([n,l,t]) => <div className="campo" key={n}><label>{l}{n !== 'imagemUrl' ? ' *' : ''}</label>{t === 'textarea' ? <textarea required value={form[n] || ''} onChange={e => setForm({...form,[n]:e.target.value})}/> : <input required={n !== 'imagemUrl'} min={t === 'number' ? 1 : undefined} type={t} value={form[n] || ''} onChange={e => setForm({...form,[n]:e.target.value})}/>}</div>)}
    <button className="botao primario" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar campanha'}</button></form></section>
}

export function CampanhaDetalhePage() {
  const { id } = useParams(), [x, setX] = useState(null), [erro, setErro] = useState('')
  useEffect(() => { api.get(`/api/campanhas/${id}`).then(setX).catch(e => setErro(e.message)) }, [id])
  if (erro) return <p className="alerta erro">{erro}</p>
  if (!x) return <div className="vazio">Carregando campanha...</div>
  return <section><div className="titulo-pagina"><h1>{x.titulo}</h1>{x.situacao === 'ATIVA' && <Link className="botao primario" to={`/doar/campanha/${x.id}`}>Doar para esta campanha</Link>}</div>
    <article className="cartao">{x.imagemUrl && <img className="imagem-campanha" src={x.imagemUrl} alt="" />}<p>{x.descricao}</p><p><strong>Objetivo:</strong> {x.objetivo}</p><p><strong>Periodo:</strong> {x.dataInicio} a {x.dataFim}</p><p><strong>Progresso:</strong> {x.recebido} de {x.metaMinima} ({x.percentual}%)</p></article>
    <h2>Necessidades desta campanha</h2>{x.necessidades?.length ? x.necessidades.map(n => <article className="cartao" key={n.id}><h3>{n.titulo}</h3><p>{n.descricao}</p><p>{n.quantidadeRecebida}/{n.quantidadeNecessaria}</p></article>) : <div className="vazio">Nenhuma necessidade vinculada.</div>}
  </section>
}
