import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../../servicos/api'

/**
 * ================ TELA DE FORMULARIO - MOLDE ================
 *
 * UM UNICO arquivo serve para CRIAR e para EDITAR.
 * Quem decide e a URL:
 *    /admin/categorias/nova  -> nao tem id -> POST (criar)
 *    /admin/categorias/5     -> tem id 5   -> PUT  (editar)
 *
 * PARA COPIAR:
 *   - troque os campos do 'formulario'
 *   - troque '/api/categorias' pela sua rota
 *   - troque os <input> pelos campos da sua entidade
 * ============================================================
 */
export default function CategoriaFormPage() {

  // useParams le o que veio na URL. useNavigate muda de tela.
  const { id } = useParams()
  const navegar = useNavigate()
  const editando = id !== undefined

  // Um unico estado com TODOS os campos do formulario.
  const [formulario, setFormulario] = useState({
    nome: '',
    descricao: ''
  })
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  // Se estiver editando, busca os dados atuais para preencher a tela.
  useEffect(() => {
    if (!editando) return

    api.get(`/api/categorias/${id}`)
      .then((dados) => setFormulario({
        nome: dados.nome,
        descricao: dados.descricao || ''
      }))
      .catch((e) => setErro(e.message))
  }, [id])

  // Uma funcao so para TODOS os campos. O 'name' do <input> tem que
  // ser igual ao nome do campo no estado 'formulario'.
  function aoDigitar(evento) {
    const { name, value } = evento.target
    setFormulario({ ...formulario, [name]: value })
  }

  async function aoEnviar(evento) {
    evento.preventDefault()   // impede a pagina de recarregar
    setErro('')
    setSalvando(true)

    try {
      if (editando) {
        await api.put(`/api/categorias/${id}`, formulario)
      } else {
        await api.post('/api/categorias', formulario)
      }
      navegar('/admin/categorias')   // volta para a lista
    } catch (e) {
      setErro(e.message)
    } finally {
      setSalvando(false)
    }
  }

  return (
    <div>
      <div className="titulo-pagina">
        <h1>{editando ? 'Editar categoria' : 'Nova categoria'}</h1>
      </div>

      {erro && <div className="alerta erro">{erro}</div>}

      <div className="cartao">
        <form onSubmit={aoEnviar}>

          <div className="campo">
            <label htmlFor="nome">Nome *</label>
            <input
              id="nome"
              name="nome"
              value={formulario.nome}
              onChange={aoDigitar}
              maxLength={100}
            />
          </div>

          <div className="campo">
            <label htmlFor="descricao">Descricao</label>
            <textarea
              id="descricao"
              name="descricao"
              value={formulario.descricao}
              onChange={aoDigitar}
              maxLength={500}
            />
          </div>

          <div className="acoes-form">
            <button className="botao primario" type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
            <button className="botao" type="button" onClick={() => navegar('/admin/categorias')}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
