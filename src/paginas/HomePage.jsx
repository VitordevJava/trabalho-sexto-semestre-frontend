import { useEffect, useState } from 'react'
import { api } from '../servicos/api'

/** RF04 - perfil institucional publico. */
export default function HomePage() {
  const [instituicao, setInstituicao] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    api.get('/api/instituicao')
      .then(setInstituicao)
      .catch((e) => setErro(e.message))
  }, [])

  if (erro) return <div className="alerta erro">{erro}</div>
  if (!instituicao) return <div className="vazio">Carregando...</div>

  return (
    <div>
      <div className="titulo-pagina"><h1>{instituicao.nome}</h1></div>
      <div className="cartao">
        <p>{instituicao.descricao}</p>
        <p><strong>Missao:</strong> {instituicao.missao}</p>
        <p><strong>Area de atuacao:</strong> {instituicao.areaAtuacao}</p>
        <p><strong>Publico atendido:</strong> {instituicao.publicoAtendido}</p>
        <p><strong>Endereco:</strong> {instituicao.logradouro}, {instituicao.numero} - {instituicao.bairro}, {instituicao.cidade}/{instituicao.estado}</p>
        <p><strong>Contato:</strong> {instituicao.telefone} {instituicao.email}</p>
      </div>
    </div>
  )
}
