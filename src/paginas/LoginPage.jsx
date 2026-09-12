import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { entrar } from '../servicos/auth'

/** RF02 - login. */
export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navegar = useNavigate()

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await entrar(email, senha)
      navegar('/')
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="caixa-login">
      <div className="cartao">
        <h1 style={{ fontSize: '20px', marginTop: 0 }}>Entrar no BemDoar</h1>

        {erro && <div className="alerta erro">{erro}</div>}

        <form onSubmit={aoEnviar}>
          <div className="campo">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" value={email}
                   onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha</label>
            <input id="senha" type="password" value={senha}
                   onChange={(e) => setSenha(e.target.value)} />
          </div>
          <button className="botao primario" type="submit" disabled={enviando}
                  style={{ width: '100%' }}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p style={{ fontSize: '14px', marginBottom: 0 }}>
          Nao tem conta? <Link to="/cadastro">Criar conta</Link>
        </p>
      </div>
    </div>
  )
}
