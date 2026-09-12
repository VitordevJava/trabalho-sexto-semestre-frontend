import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { erro: false }
  }

  static getDerivedStateFromError() {
    return { erro: true }
  }

  componentDidCatch(erro, detalhes) {
    console.error('Erro inesperado na interface:', erro, detalhes)
  }

  render() {
    if (this.state.erro) {
      return (
        <main className="container">
          <div className="cartao erro-global">
            <h1>Esta pagina encontrou um problema</h1>
            <p>Seus dados nao foram perdidos. Atualize a pagina ou volte ao inicio.</p>
            <div className="acoes-form">
              <button className="botao primario" onClick={() => window.location.reload()}>Tentar novamente</button>
              <a className="botao" href="/">Voltar ao inicio</a>
            </div>
          </div>
        </main>
      )
    }
    return this.props.children
  }
}
