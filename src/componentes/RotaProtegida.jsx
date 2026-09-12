import { Navigate } from 'react-router-dom'
import { estaLogado, ehAdministrador } from '../servicos/auth'

/**
 * Esconde uma tela de quem nao pode ver.
 *
 * IMPORTANTE (RG-AUT-01 do documento de requisitos):
 * isto e so conveniencia visual. A seguranca de verdade esta no
 * backend, com @PreAuthorize. Esconder botao NAO e seguranca.
 *
 * NAO E NECESSARIO ALTERAR ESTE ARQUIVO.
 */
export default function RotaProtegida({ children, somenteAdmin = false }) {
  if (!estaLogado()) {
    return <Navigate to="/login" replace />
  }
  if (somenteAdmin && !ehAdministrador()) {
    return (
      <div className="alerta erro">
        Voce nao possui permissao para acessar esta area.
      </div>
    )
  }
  return children
}
