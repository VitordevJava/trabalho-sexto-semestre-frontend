import { Link } from 'react-router-dom'

export default function Brand({ compacto = false, escuro = false }) {
  return <Link className={`brand ${compacto ? 'brand-compacto' : ''} ${escuro ? 'brand-escuro' : ''}`} to="/" aria-label="BemDoar - pagina inicial">
    <img className="brand-simbolo" src="/assets/logo-bemdoar.png" alt="" aria-hidden="true" />
    <span className="brand-nome">Bem<span>Doar</span></span>
    {!compacto && <small>Doar faz bem. Receber transforma.</small>}
  </Link>
}
