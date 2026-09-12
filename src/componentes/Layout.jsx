import { Link, NavLink, useNavigate } from 'react-router-dom'
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
        <NavLink to="/" end>Inicio</NavLink>
        <NavLink to="/necessidades">Necessidades</NavLink>
        <NavLink to="/campanhas">Campanhas</NavLink>
        <NavLink to="/oportunidades">Voluntariado</NavLink>
        <NavLink to="/acoes">Acoes sociais</NavLink>
        <NavLink to="/comunicados">Comunicados</NavLink>
        <NavLink to="/transparencia">Transparencia</NavLink>

        {/* ---------- area administrativa ---------- */}
        {admin && <NavLink to="/admin/categorias">Categorias</NavLink>}
        {admin && <NavLink to="/admin/instituicao">Instituicao</NavLink>}
        {admin && <NavLink to="/admin/necessidades">Gerir necessidades</NavLink>}
        {admin && <NavLink to="/admin/doacoes">Gerir doacoes</NavLink>}
        {admin && <NavLink to="/admin/campanhas">Gerir campanhas</NavLink>}
        {admin && <NavLink to="/admin/oportunidades">Gerir voluntariado</NavLink>}
        {admin && <NavLink to="/admin/acoes">Gerir acoes</NavLink>}
        {admin && <NavLink to="/admin/comunicados">Gerir comunicados</NavLink>}
        {usuario && !admin && <NavLink to="/minhas-doacoes">Minhas doacoes</NavLink>}
        {usuario && !admin && <NavLink to="/meu-voluntariado">Meu voluntariado</NavLink>}
        {usuario && <NavLink to="/notificacoes">Notificacoes</NavLink>}
        {usuario && <NavLink to="/perfil">Meu perfil</NavLink>}

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
