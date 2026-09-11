import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { usuarioLogado, sair, ehAdministrador } from '../servicos/auth'
import Brand from './Brand'
import BottomNav from './BottomNav'
import Icone from './Icone'

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
  const localizacao = useLocation()
  const paginaAutenticacao = ['/login', '/cadastro', '/recuperar-senha'].includes(localizacao.pathname)

  function aoSair() {
    sair()
    navegar('/login')
  }

  if (paginaAutenticacao) return <main className="auth-layout">{children}</main>

  return (
    <>
      <header className="cabecalho">
        <div className="cabecalho-interno">
        <Brand compacto escuro />
        <nav className="navegacao" aria-label="Navegacao principal">

        {/* ---------- publico (todo mundo ve) ---------- */}
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/necessidades">Necessidades</NavLink>
        <NavLink to="/transparencia">Transparencia</NavLink>
        {/* FRENTE 2 - adicione aqui: <Link to="/campanhas">Campanhas</Link> */}
        {/* FRENTE 3 - adicione aqui: <Link to="/oportunidades">Voluntariado</Link> */}
        {/* FRENTE 4 - adicione aqui: <Link to="/acoes">Acoes sociais</Link> */}

        {/* ---------- area administrativa ---------- */}
        {admin && <Link to="/admin/categorias">Categorias</Link>}
        {admin && <Link to="/admin/necessidades">Gerir necessidades</Link>}
        {usuario && !admin && <NavLink to="/minhas-doacoes">Minhas doacoes</NavLink>}
        {admin && <NavLink to="/admin/doacoes">Gerir doacoes</NavLink>}
        {/* FRENTE 2 - adicione aqui: <Link to="/admin/campanhas">Gerir campanhas</Link> */}
        {/* FRENTE 3 - adicione aqui: <Link to="/admin/oportunidades">Gerir voluntariado</Link> */}
        {/* FRENTE 4 - adicione aqui: <Link to="/admin/acoes">Gerir acoes</Link> */}

        </nav>
        <span className="direita">
          {usuario ? (
            <>
              <span className="usuario-cabecalho"><Icone nome="usuario" tamanho={18} />{usuario.nome}</span>
              <button className="botao botao-cabecalho" onClick={aoSair} aria-label="Sair"><Icone nome="sair" tamanho={18} />Sair</button>
            </>
          ) : (
            <>
              <Link className="link-entrar" to="/login">Entrar</Link>
              <Link className="botao botao-claro" to="/cadastro">Criar conta</Link>
            </>
          )}
        </span>
        </div>
      </header>

      <main className="container">{children}</main>
      <BottomNav />
    </>
  )
}
