import { useEffect, useState } from 'react'
import { api } from '../../servicos/api'

const campos = [
  ['nome', 'Nome', true], ['descricao', 'Descricao', true, 'textarea'], ['missao', 'Missao', true, 'textarea'],
  ['areaAtuacao', 'Area de atuacao', true], ['publicoAtendido', 'Publico atendido', true], ['cep', 'CEP', true],
  ['logradouro', 'Logradouro', true], ['numero', 'Numero', true], ['complemento', 'Complemento'], ['bairro', 'Bairro', true],
  ['cidade', 'Cidade', true], ['estado', 'Estado (UF)', true], ['telefone', 'Telefone'], ['whatsapp', 'WhatsApp'],
  ['email', 'E-mail'], ['historia', 'Historia', false, 'textarea'], ['redesSociais', 'Redes sociais'],
  ['horarioAtendimento', 'Horario de atendimento'], ['logoUrl', 'URL do logo']
]

export default function InstituicaoFormPage() {
  const [form, setForm] = useState(null)
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState('')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => { api.get('/api/instituicao').then(setForm).catch(e => setErro(e.message)) }, [])

  async function salvar(evento) {
    evento.preventDefault(); setSalvando(true); setErro(''); setOk('')
    try { setForm(await api.put('/api/instituicao', form)); setOk('Dados institucionais atualizados.') }
    catch (e) { setErro(e.message) } finally { setSalvando(false) }
  }

  if (!form && !erro) return <div className="vazio">Carregando dados da instituicao...</div>
  return <section><div className="titulo-pagina"><h1>Editar instituicao</h1></div>
    {erro && <p className="alerta erro">{erro}</p>}{ok && <p className="alerta ok">{ok}</p>}
    {form && <form className="cartao" onSubmit={salvar}>{campos.map(([nome, rotulo, obrigatorio, tipo]) =>
      <div className="campo" key={nome}><label>{rotulo}{obrigatorio ? ' *' : ''}</label>
        {tipo === 'textarea'
          ? <textarea required={obrigatorio} value={form[nome] || ''} onChange={e => setForm({ ...form, [nome]: e.target.value })} />
          : <input required={obrigatorio} maxLength={nome === 'estado' ? 2 : undefined} type={nome === 'email' ? 'email' : nome === 'logoUrl' ? 'url' : 'text'} value={form[nome] || ''} onChange={e => setForm({ ...form, [nome]: nome === 'estado' ? e.target.value.toUpperCase() : e.target.value })} />}
      </div>)}<button className="botao primario" disabled={salvando}>{salvando ? 'Salvando...' : 'Salvar dados'}</button></form>}
  </section>
}
