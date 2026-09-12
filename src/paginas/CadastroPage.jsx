import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { api } from '../servicos/api'

/** RF01 - cadastro publico. Sempre cria perfil USUARIO. */
export default function CadastroPage() {
  const [formulario, setFormulario] = useState({
    nome: '', email: '', senha: '', confirmacaoSenha: '',
    telefone: '', dataNascimento: '', aceiteTermos: false
  })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const navegar = useNavigate()

  function aoDigitar(evento) {
    const { name, value, type, checked } = evento.target
    setFormulario({ ...formulario, [name]: type === 'checkbox' ? checked : value })
  }

  async function aoEnviar(evento) {
    evento.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await api.post('/api/auth/cadastro', formulario)
      navegar('/login')
    } catch (e) {
      setErro(e.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="caixa-login">
      <div className="cartao">
        <h1 style={{ fontSize: '20px', marginTop: 0 }}>Criar conta</h1>

        {erro && <div className="alerta erro">{erro}</div>}

        <form onSubmit={aoEnviar}>
          <div className="campo">
            <label htmlFor="nome">Nome *</label>
            <input id="nome" name="nome" value={formulario.nome} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label htmlFor="email">E-mail *</label>
            <input id="email" name="email" type="email" value={formulario.email} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label htmlFor="senha">Senha * (minimo 8 caracteres)</label>
            <input id="senha" name="senha" type="password" value={formulario.senha} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label htmlFor="confirmacaoSenha">Confirmar senha *</label>
            <input id="confirmacaoSenha" name="confirmacaoSenha" type="password"
                   value={formulario.confirmacaoSenha} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label htmlFor="telefone">Telefone</label>
            <input id="telefone" name="telefone" value={formulario.telefone} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label htmlFor="dataNascimento">Data de nascimento *</label>
            <input id="dataNascimento" name="dataNascimento" type="date"
                   value={formulario.dataNascimento} onChange={aoDigitar} />
          </div>
          <div className="campo">
            <label style={{ fontWeight: 400 }}>
              <input type="checkbox" name="aceiteTermos" checked={formulario.aceiteTermos}
                     onChange={aoDigitar} style={{ width: 'auto', marginRight: '8px' }} />
              Aceito os Termos de Uso e a Politica de Privacidade *
            </label>
          </div>

          <button className="botao primario" type="submit" disabled={enviando} style={{ width: '100%' }}>
            {enviando ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>

        <p style={{ fontSize: '14px', marginBottom: 0 }}>
          Ja tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  )
}
