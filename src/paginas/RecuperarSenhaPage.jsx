import { useState } from 'react'
import { Link } from 'react-router-dom'
import Brand from '../componentes/Brand'

export default function RecuperarSenhaPage() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)

  function enviar(evento) {
    evento.preventDefault()
    setEnviado(true)
  }

  return <section className="auth-pagina">
    <div className="auth-card">
      <Brand />
      <div className="auth-intro"><p className="sobrelinha">Recuperar acesso</p><h1>Esqueceu a senha?</h1><p>Informe seu e-mail para receber as orientacoes de recuperacao.</p></div>
      {enviado ? <div className="estado-sucesso"><span>✓</span><h2>Solicitacao registrada</h2><p>Se o e-mail estiver cadastrado, voce recebera as orientacoes.</p><Link className="botao primario botao-bloco" to="/login">Voltar para entrar</Link></div> : <form className="auth-form" onSubmit={enviar}><div className="campo"><label htmlFor="recuperarEmail">E-mail</label><input id="recuperarEmail" type="email" required autoComplete="email" placeholder="voce@email.com" value={email} onChange={e => setEmail(e.target.value)} /></div><button className="botao primario botao-bloco">Recuperar senha</button><Link className="link-voltar" to="/login">Voltar para entrar</Link></form>}
    </div>
    <div className="auth-ondas" aria-hidden="true"><i /><b /></div>
  </section>
}
