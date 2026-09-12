import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../servicos/api'
import { sair } from '../../servicos/auth'

export default function PerfilPage() {
  const navegar = useNavigate()
  const [perfil, setPerfil] = useState(null)
  const [senha, setSenha] = useState({ senhaAtual: '', novaSenha: '', confirmacaoSenha: '' })
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    api.get('/api/auth/eu').then(setPerfil).catch(e => setErro(e.message))
  }, [])

  function mensagem(texto, falhou = false) {
    setErro(falhou ? texto : '')
    setOk(falhou ? '' : texto)
  }

  async function salvarPerfil(evento) {
    evento.preventDefault()
    setSalvando(true)
    try {
      const atualizado = await api.put('/api/auth/perfil', {
        nome: perfil.nome,
        email: perfil.email,
        telefone: perfil.telefone || ''
      })
      setPerfil(atualizado)
      const sessao = JSON.parse(localStorage.getItem('bemdoar_usuario') || '{}')
      localStorage.setItem('bemdoar_usuario', JSON.stringify({ ...sessao, ...atualizado }))
      mensagem('Perfil atualizado com sucesso.')
    } catch (e) { mensagem(e.message, true) } finally { setSalvando(false) }
  }

  async function alterarSenha(evento) {
    evento.preventDefault()
    if (senha.novaSenha !== senha.confirmacaoSenha) return mensagem('A confirmacao nao corresponde a nova senha.', true)
    setSalvando(true)
    try {
      await api.put('/api/auth/senha', senha)
      setSenha({ senhaAtual: '', novaSenha: '', confirmacaoSenha: '' })
      mensagem('Senha alterada com sucesso.')
    } catch (e) { mensagem(e.message, true) } finally { setSalvando(false) }
  }

  async function desativar() {
    if (!window.confirm('Deseja realmente desativar sua conta?')) return
    try {
      await api.remove('/api/auth/conta')
      sair()
      navegar('/login')
    } catch (e) { mensagem(e.message, true) }
  }

  if (!perfil && !erro) return <div className="vazio">Carregando perfil...</div>

  return <section>
    <div className="titulo-pagina"><h1>Meu perfil</h1></div>
    {erro && <p className="alerta erro">{erro}</p>}{ok && <p className="alerta ok">{ok}</p>}
    {perfil && <>
      <form className="cartao" onSubmit={salvarPerfil}>
        <h2>Dados pessoais</h2>
        <div className="campo"><label>Nome *</label><input required value={perfil.nome} onChange={e => setPerfil({ ...perfil, nome: e.target.value })} /></div>
        <div className="campo"><label>E-mail *</label><input required type="email" value={perfil.email} onChange={e => setPerfil({ ...perfil, email: e.target.value })} /></div>
        <div className="campo"><label>Telefone</label><input value={perfil.telefone || ''} onChange={e => setPerfil({ ...perfil, telefone: e.target.value })} /></div>
        <div className="campo"><label>Data de nascimento</label><input disabled value={perfil.dataNascimento || ''} /></div>
        <button className="botao primario" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar perfil'}</button>
      </form>
      <form className="cartao" onSubmit={alterarSenha}>
        <h2>Alterar senha</h2>
        <div className="campo"><label>Senha atual *</label><input required type="password" value={senha.senhaAtual} onChange={e => setSenha({ ...senha, senhaAtual: e.target.value })} /></div>
        <div className="campo"><label>Nova senha *</label><input required minLength="8" type="password" value={senha.novaSenha} onChange={e => setSenha({ ...senha, novaSenha: e.target.value })} /></div>
        <div className="campo"><label>Confirmar nova senha *</label><input required minLength="8" type="password" value={senha.confirmacaoSenha} onChange={e => setSenha({ ...senha, confirmacaoSenha: e.target.value })} /></div>
        <button className="botao primario" disabled={salvando}>Alterar senha</button>
      </form>
      <div className="cartao zona-perigo"><h2>Desativar conta</h2><p>O historico sera preservado, mas nao sera mais possivel entrar.</p><button className="botao perigo" onClick={desativar}>Desativar minha conta</button></div>
    </>}
  </section>
}
