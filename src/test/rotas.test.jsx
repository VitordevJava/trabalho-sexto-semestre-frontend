import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'

afterEach(() => { cleanup(); vi.restoreAllMocks(); localStorage.clear() })

function resposta(dados, status = 200) {
  return Promise.resolve({ ok: status >= 200 && status < 300, status, text: () => Promise.resolve(JSON.stringify(dados)) })
}

describe('rotas publicas', () => {
  it.each([
    ['/campanhas', 'Nenhuma campanha disponivel.'],
    ['/oportunidades', 'Nenhuma oportunidade disponivel.'],
    ['/acoes', 'Nenhuma acao social disponivel.'],
    ['/comunicados', 'Nenhum comunicado publicado.']
  ])('renderiza %s sem tela branca', async (rota, mensagem) => {
    vi.stubGlobal('fetch', vi.fn(() => resposta([])))
    render(<MemoryRouter initialEntries={[rota]}><App /></MemoryRouter>)
    expect(await screen.findByText(mensagem)).toBeInTheDocument()
  })

  it('protege o perfil de visitantes', async () => {
    render(<MemoryRouter initialEntries={['/perfil']}><App /></MemoryRouter>)
    expect(await screen.findByRole('heading', { name: 'Entrar no BemDoar' })).toBeInTheDocument()
  })
})
