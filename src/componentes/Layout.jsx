import { Link, useNavigate } from 'react-router-dom'
import { usuarioLogado, sair, ehAdministrador } from '../servicos/auth'

/**
 * Menu do topo + moldura de todas as telas.
 *
 * ====================================================================
 * ESTE E O UNICO ARQUIVO COMPARTILHADO QUE VOCE VAI PRECISAR EDITAR.
 * Voce so adiciona 1 <Link> do seu modulo, na secao da sua frente.
 * NAO mexa nas linhas das outras frentes -> evita conflito de merge.
 * ====================================================================
 */
export default function Layout({ children }) {
  const usuario = usuarioLogado()
  const admin = ehAdministrador()
  const navegar = useNavigate()

  function aoSair() {
    sair()
    navegar('/login')
  }

  return (
    <>
      <header className="cabecalho">
        <span className="marca">BemDoar</span>

        {/* ---------- publico (todo mundo ve) ---------- */}
        <Link to="/">Inicio</Link>
        <Link to="/necessidades">Necessidades</Link>
        {/* FRENTE 2 - adicione aqui: <Link to="/campanhas">Campanhas</Link> */}
        {/* FRENTE 3 - adicione aqui: <Link to="/oportunidades">Voluntariado</Link> */}
        {/* FRENTE 4 - adicione aqui: <Link to="/acoes">Acoes sociais</Link> */}

        {/* ---------- area administrativa ---------- */}
        {admin && <Link to="/admin/categorias">Categorias</Link>}
        {admin && <Link to="/admin/necessidades">Gerir necessidades</Link>}
        {/* FRENTE 1 - adicione aqui: <Link to="/admin/doacoes">Gerir doacoes</Link> */}
        {/* FRENTE 2 - adicione aqui: <Link to="/admin/campanhas">Gerir campanhas</Link> */}
        {/* FRENTE 3 - adicione aqui: <Link to="/admin/oportunidades">Gerir voluntariado</Link> */}
        {/* FRENTE 4 - adicione aqui: <Link to="/admin/acoes">Gerir acoes</Link> */}

        <span className="direita">
          {usuario ? (
            <>
              <span>{usuario.nome}</span>
              <button className="botao pequeno" onClick={aoSair}>Sair</button>
            </>
          ) : (
            <>
              <Link to="/login">Entrar</Link>
              <Link to="/cadastro">Criar conta</Link>
            </>
          )}
        </span>
      </header>

      <main className="container">{children}</main>
    </>
  )
}
