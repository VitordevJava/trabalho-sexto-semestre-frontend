import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../servicos/api'

const dataHora = valor => valor ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(valor)) : '-'

export function MinhasCandidaturasPage() {
  const [itens, setItens] = useState([]), [erro, setErro] = useState(''), [carregando, setCarregando] = useState(true)
  const carregar = () => { setCarregando(true); return api.get('/api/candidaturas/minhas').then(setItens).catch(e => setErro(e.message)).finally(() => setCarregando(false)) }
  useEffect(() => { carregar() }, [])
  async function cancelar(item) { if (!window.confirm(`Cancelar a candidatura para "${item.oportunidadeTitulo}"?`)) return; try { await api.patch(`/api/candidaturas/${item.id}/cancelar`); await carregar() } catch (e) { setErro(e.message) } }
  return <section><h1>Meu voluntariado</h1>{erro && <p className="alerta erro">{erro}</p>}{carregando ? <div className="vazio">Carregando candidaturas...</div> : itens.length === 0 ? <div className="vazio">Voce ainda nao possui candidaturas.</div> : itens.map(i => <article className="cartao" key={i.id}><h2>{i.oportunidadeTitulo}</h2><p>Enviada em {dataHora(i.dataCandidatura)}</p><p><span className="etiqueta">{i.situacao}</span> {i.resultado && `Participacao: ${i.resultado}`}</p>{i.motivoRecusa && <p><strong>Motivo:</strong> {i.motivoRecusa}</p>}{['PENDENTE','APROVADA'].includes(i.situacao) && <button className="botao perigo" onClick={() => cancelar(i)}>Cancelar candidatura</button>}</article>)}</section>
}

export function CandidatosAdminPage() {
  const { id } = useParams(), [itens, setItens] = useState([]), [erro, setErro] = useState(''), [carregando, setCarregando] = useState(true)
  const carregar = () => { setCarregando(true); return api.get(`/api/oportunidades/${id}/candidaturas`).then(setItens).catch(e => setErro(e.message)).finally(() => setCarregando(false)) }
  useEffect(() => { carregar() }, [id])
  async function decidir(item, acao) {
    if (!window.confirm(`${acao === 'aprovar' ? 'Aprovar' : 'Recusar'} a candidatura de ${item.usuarioNome}?`)) return
    let corpo
    if (acao === 'recusar') { const motivo = window.prompt('Informe o motivo da recusa:'); if (!motivo) return; corpo = { motivo } }
    try { await api.patch(`/api/candidaturas/${item.id}/${acao}`, corpo); await carregar() } catch (e) { setErro(e.message) }
  }
  async function registrar(item, resultado) {
    if (!window.confirm(`Registrar ${resultado.toLowerCase()} para ${item.usuarioNome}?`)) return
    const observacao = window.prompt('Observacao da participacao (opcional):') || ''
    try { await api.post(`/api/candidaturas/${item.id}/participacao`, { resultado, observacao }); await carregar() } catch (e) { setErro(e.message) }
  }
  return <section><h1>Candidatos</h1>{erro && <p className="alerta erro">{erro}</p>}{carregando ? <div className="vazio">Carregando candidatos...</div> : itens.length === 0 ? <div className="vazio">Nenhuma candidatura recebida.</div> : itens.map(c => <article className="cartao" key={c.id}><h2>{c.usuarioNome}</h2><p>{c.oportunidadeTitulo} — candidatura em {dataHora(c.dataCandidatura)}</p><p><span className="etiqueta">{c.situacao}</span> {c.resultado && `Participacao: ${c.resultado}`}</p>{c.motivoRecusa && <p><strong>Motivo:</strong> {c.motivoRecusa}</p>}
    {c.situacao === 'PENDENTE' && <div className="acoes-form"><button className="botao primario" onClick={() => decidir(c,'aprovar')}>Aprovar</button><button className="botao perigo" onClick={() => decidir(c,'recusar')}>Recusar</button></div>}
    {c.situacao === 'APROVADA' && !c.resultado && <div className="acoes-form"><button className="botao primario" onClick={() => registrar(c,'PRESENTE')}>Registrar presente</button><button className="botao" onClick={() => registrar(c,'AUSENTE')}>Registrar ausente</button></div>}
  </article>)}</section>
}
