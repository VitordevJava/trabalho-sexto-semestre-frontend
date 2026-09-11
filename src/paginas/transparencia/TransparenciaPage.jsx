import { useEffect, useState } from 'react'
import { api } from '../../servicos/api'

const indicadores = [
  ['doacoesRecebidas', 'Doacoes recebidas', 'Itens que chegaram a instituicao'],
  ['campanhas', 'Campanhas', 'Mobilizacoes cadastradas'],
  ['acoes', 'Acoes sociais', 'Iniciativas da organizacao'],
  ['beneficiados', 'Beneficiados', 'Pessoas alcancadas pelas acoes'],
  ['voluntarios', 'Voluntarios', 'Pessoas com participacao registrada']
]

export default function TransparenciaPage() {
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => { api.get('/api/transparencia').then(setDados).catch(e => setErro(e.message)) }, [])

  return <section>
    <div className="hero-transparencia"><p className="sobrelinha">Impacto aberto</p><h1>Transparencia que aproxima</h1><p>Acompanhe os resultados do BemDoar. Os indicadores sao atualizados a partir dos registros confirmados no sistema.</p></div>
    {erro && <div className="alerta erro" role="alert">{erro}</div>}
    {!dados && !erro ? <div className="vazio">Carregando indicadores...</div> : dados && <div className="grade-indicadores">{indicadores.map(([campo, titulo, descricao]) => <article className="cartao indicador" key={campo}><strong>{dados[campo] ?? 0}</strong><h2>{titulo}</h2><p>{descricao}</p></article>)}</div>}
  </section>
}
