import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../servicos/api'

export function DoacaoFormPage({ destino }) {
  const { id } = useParams(), navegar = useNavigate(), [alvo, setAlvo] = useState(null), [erro, setErro] = useState(''), [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState({ item: '', quantidade: 1, observacao: '', formaEntrega: 'ENTREGA_NA_INSTITUICAO' })
  useEffect(() => { api.get(`/api/${destino === 'campanha' ? 'campanhas' : 'necessidades'}/${id}`).then(setAlvo).catch(e => setErro(e.message)) }, [id, destino])
  async function salvar(e) { e.preventDefault(); setSalvando(true); try { await api.post('/api/doacoes', { ...form, [destino === 'campanha' ? 'campanhaId' : 'necessidadeId']: Number(id), quantidade: Number(form.quantidade) }); navegar('/minhas-doacoes') } catch (e) { setErro(e.message) } finally { setSalvando(false) } }
  return <section><h1>Registrar doacao</h1>{erro && <p className="alerta erro">{erro}</p>}{!alvo && !erro ? <div className="vazio">Carregando destino...</div> : alvo && <form className="cartao" onSubmit={salvar}><p>Destino: <strong>{alvo.titulo}</strong></p>
    <div className="campo"><label>Item *</label><input required value={form.item} onChange={e => setForm({...form,item:e.target.value})}/></div>
    <div className="campo"><label>Quantidade *</label><input required min="1" type="number" value={form.quantidade} onChange={e => setForm({...form,quantidade:e.target.value})}/></div>
    <div className="campo"><label>Observacao</label><textarea value={form.observacao} onChange={e => setForm({...form,observacao:e.target.value})}/></div>
    <div className="campo"><label>Forma de entrega *</label><select value={form.formaEntrega} onChange={e => setForm({...form,formaEntrega:e.target.value})}><option value="ENTREGA_NA_INSTITUICAO">Entrega na instituicao</option><option value="COMBINAR_ENTREGA">Combinar entrega</option></select></div>
    <button className="botao primario" disabled={salvando}>{salvando ? 'Enviando...' : 'Registrar doacao'}</button></form>}</section>
}
