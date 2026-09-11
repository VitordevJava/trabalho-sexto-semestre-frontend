import { useEffect, useState } from 'react'
import { api } from '../../servicos/api'

export default function DoacaoAdminPage() {
  const [doacoes, setDoacoes] = useState([])
  const [situacao, setSituacao] = useState('')
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  async function carregar(filtro = situacao) {
    setCarregando(true)
    setErro('')
    try { setDoacoes(await api.get(`/api/doacoes${filtro ? `?situacao=${filtro}` : ''}`)) }
    catch (e) { setErro(e.message) }
    finally { setCarregando(false) }
  }

  useEffect(() => { carregar(situacao) }, [situacao])

  async function executar(doacao, acao) {
    let corpo
    if (acao === 'cancelar') {
      const motivo = window.prompt('Informe o motivo do cancelamento:')
      if (motivo === null) return
      corpo = { motivo }
    }
    try { await api.patch(`/api/doacoes/${doacao.id}/${acao}`, corpo); await carregar() }
    catch (e) { setErro(e.message) }
  }

  return <section>
    <p className="sobrelinha">Administracao</p>
    <div className="titulo-pagina"><h1>Gerir doacoes</h1></div>
    <div className="filtros cartao filtros-compactos"><div className="campo"><label htmlFor="filtroSituacao">Situacao</label><select id="filtroSituacao" value={situacao} onChange={e => setSituacao(e.target.value)}><option value="">Todas</option><option value="PENDENTE">Pendentes</option><option value="CONFIRMADA">Confirmadas</option><option value="RECEBIDA">Recebidas</option><option value="CANCELADA">Canceladas</option></select></div></div>
    {erro && <div className="alerta erro" role="alert">{erro}</div>}
    {carregando ? <div className="vazio">Carregando...</div> : doacoes.length === 0 ? <div className="cartao vazio">Nenhuma doacao encontrada.</div> :
      <div className="grade-doacoes">{doacoes.map(doacao => <article className="cartao cartao-doacao" key={doacao.id}>
        <div className="linha-cartao"><h2>{doacao.item}</h2><span className={`etiqueta situacao-${doacao.situacao.toLowerCase()}`}>{doacao.situacao}</span></div>
        <dl className="detalhes-doacao"><div><dt>Doador</dt><dd>{doacao.usuarioNome}</dd></div><div><dt>Quantidade</dt><dd>{doacao.quantidade}</dd></div><div><dt>Destino</dt><dd>{doacao.necessidadeTitulo || doacao.campanhaTitulo}</dd></div></dl>
        <div className="acoes-form acoes-administrativas">{doacao.situacao === 'PENDENTE' && <button className="botao" onClick={() => executar(doacao, 'confirmar')}>Confirmar</button>}{doacao.situacao === 'CONFIRMADA' && <button className="botao primario" onClick={() => executar(doacao, 'receber')}>Registrar recebimento</button>}{['PENDENTE', 'CONFIRMADA'].includes(doacao.situacao) && <button className="botao perigo" onClick={() => executar(doacao, 'cancelar')}>Cancelar</button>}</div>
      </article>)}</div>}
  </section>
}
