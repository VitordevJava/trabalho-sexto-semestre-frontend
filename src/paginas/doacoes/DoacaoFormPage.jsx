import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { api } from '../../servicos/api'
import Icone from '../../componentes/Icone'

export default function DoacaoFormPage({ destino = 'necessidade' }) {
  const { id } = useParams()
  const navegar = useNavigate()
  const [alvo, setAlvo] = useState(null)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [form, setForm] = useState({
    item: '', quantidade: 1, observacao: '', formaEntrega: 'ENTREGA_NA_INSTITUICAO'
  })

  useEffect(() => {
    const recurso = destino === 'campanha' ? 'campanhas' : 'necessidades'
    api.get(`/api/${recurso}/${id}`).then(setAlvo).catch(e => setErro(e.message))
  }, [destino, id])

  function alterar(evento) {
    setForm({ ...form, [evento.target.name]: evento.target.value })
  }

  async function salvar(evento) {
    evento.preventDefault()
    setSalvando(true)
    setErro('')
    try {
      const campoDestino = destino === 'campanha' ? 'campanhaId' : 'necessidadeId'
      await api.post('/api/doacoes', {
        ...form,
        [campoDestino]: Number(id),
        quantidade: Number(form.quantidade)
      })
      navegar('/minhas-doacoes')
    } catch (e) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  return <section className="pagina-estreita">
    <Link className="link-voltar link-voltar-pagina" to={alvo ? `/necessidades/${alvo.id}` : '/necessidades'}><Icone nome="seta" tamanho={18}/>Voltar</Link>
    <p className="sobrelinha">Sua contribuicao</p>
    <h1>Registrar doacao</h1>
    <p className="texto-apoio">Informe o item e como pretende entrega-lo. A doacao ficara pendente ate a confirmacao.</p>
    {erro && <div className="alerta erro" role="alert">{erro}</div>}
    {!alvo && !erro ? <div className="vazio">Carregando destino...</div> : alvo &&
      <form className="cartao formulario-doacao" onSubmit={salvar}>
        <div className="resumo-destino"><span className="resumo-icone"><Icone nome="caixa" /></span><div><small>Destino da doacao</small><strong>{alvo.titulo}</strong></div></div>
        <div className="campo"><label htmlFor="item">Item</label><input id="item" name="item" required maxLength="150" value={form.item} onChange={alterar} placeholder="Ex.: arroz, cobertor ou kit" /></div>
        <div className="campo"><label htmlFor="quantidade">Quantidade</label><input id="quantidade" name="quantidade" required min="1" inputMode="numeric" type="number" value={form.quantidade} onChange={alterar} /></div>
        <div className="campo"><label htmlFor="observacao">Observacao</label><textarea id="observacao" name="observacao" maxLength="500" value={form.observacao} onChange={alterar} placeholder="Detalhes opcionais sobre os itens" /></div>
        <div className="campo"><label htmlFor="formaEntrega">Forma de entrega</label><select id="formaEntrega" name="formaEntrega" value={form.formaEntrega} onChange={alterar}><option value="ENTREGA_NA_INSTITUICAO">Entregar na instituicao</option><option value="COMBINAR_ENTREGA">Combinar entrega</option></select></div>
        <button className="botao primario botao-bloco" disabled={salvando}>{salvando ? 'Registrando...' : 'Registrar intencao de doar'}</button>
      </form>}
  </section>
}
