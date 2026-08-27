import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../servicos/api'

/**
 * ==================== TELA DE LISTA - MOLDE ====================
 *
 * Toda tela de lista do BemDoar tem exatamente estas 5 partes.
 * Copie este arquivo, troque os nomes, e a sua tela funciona.
 *
 *   1. os 4 estados (lista, carregando, erro, aviso)
 *   2. a funcao carregar()  -> busca no backend
 *   3. o useEffect          -> chama carregar() quando a tela abre
 *   4. as funcoes de acao   -> desativar, excluir, etc.
 *   5. o return com a tabela
 *
 * PARA COPIAR:
 *   - troque 'categoria' por 'campanha' (ou o seu nome) em tudo
 *   - troque '/api/categorias' pela sua rota
 *   - troque as colunas da tabela pelos seus campos
 * ===============================================================
 */
export default function CategoriaListaPage() {

  // 1. ESTADOS -------------------------------------------------
  // 'useState' guarda um valor que muda. Quando ele muda, o React
  // redesenha a tela sozinho.
  const [categorias, setCategorias] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  // 2. CARREGAR ------------------------------------------------
  async function carregar() {
    setCarregando(true)
    setErro('')
    try {
      const dados = await api.get('/api/categorias')
      setCategorias(dados)
    } catch (e) {
      setErro(e.message)
    } finally {
      setCarregando(false)
    }
  }

  // 3. USEEFFECT -----------------------------------------------
  // Roda uma unica vez, quando a tela abre. O [] no final e o que
  // faz ser "uma unica vez". Nao esqueca dele.
  useEffect(() => {
    carregar()
  }, [])

  // 4. ACOES ---------------------------------------------------
  async function alternarAtivo(categoria) {
    setErro('')
    setAviso('')
    try {
      const rota = categoria.ativo ? 'desativar' : 'reativar'
      await api.patch(`/api/categorias/${categoria.id}/${rota}`)
      setAviso(categoria.ativo ? 'Categoria desativada.' : 'Categoria reativada.')
      carregar()   // recarrega a lista para mostrar o novo estado
    } catch (e) {
      setErro(e.message)
    }
  }

  async function excluir(categoria) {
    // window.confirm devolve true/false. Simples e suficiente.
    if (!window.confirm(`Excluir a categoria "${categoria.nome}"?`)) return

    setErro('')
    setAviso('')
    try {
      await api.remove(`/api/categorias/${categoria.id}`)
      setAviso('Categoria excluida.')
      carregar()
    } catch (e) {
      // Se a categoria estiver em uso, o backend devolve a mensagem
      // certa (RN17) e ela aparece aqui. Nao precisa tratar nada.
      setErro(e.message)
    }
  }

  // 5. TELA ----------------------------------------------------
  return (
    <div>
      <div className="titulo-pagina">
        <h1>Categorias</h1>
        <Link className="botao primario" to="/admin/categorias/nova">Nova categoria</Link>
      </div>

      {erro && <div className="alerta erro">{erro}</div>}
      {aviso && <div className="alerta ok">{aviso}</div>}

      <div className="cartao">
        {carregando ? (
          <div className="vazio">Carregando...</div>
        ) : categorias.length === 0 ? (
          <div className="vazio">Nenhuma categoria cadastrada.</div>
        ) : (
          <table className="tabela">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Descricao</th>
                <th>Situacao</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id}>
                  <td>{categoria.nome}</td>
                  <td>{categoria.descricao}</td>
                  <td>
                    <span className={'etiqueta ' + (categoria.ativo ? 'verde' : 'cinza')}>
                      {categoria.ativo ? 'Ativa' : 'Inativa'}
                    </span>
                  </td>
                  <td className="acoes">
                    <Link className="botao pequeno" to={`/admin/categorias/${categoria.id}`}>
                      Editar
                    </Link>
                    <button className="botao pequeno" onClick={() => alternarAtivo(categoria)}>
                      {categoria.ativo ? 'Desativar' : 'Reativar'}
                    </button>
                    <button className="botao pequeno perigo" onClick={() => excluir(categoria)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
