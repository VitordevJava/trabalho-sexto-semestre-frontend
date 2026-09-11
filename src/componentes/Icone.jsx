const caminhos = {
  inicio: <><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5M9 20v-6h6v6"/></>,
  necessidades: <><path d="M4 6.5 8 5l4 1.5L16 5l4 1.5v13L16 18l-4 1.5L8 18l-4 1.5z"/><path d="M8 5v13M12 6.5v13M16 5v13"/></>,
  doar: <><path d="M4 9h16v11H4zM2.5 9h19M8 9V6.5A2.5 2.5 0 0 1 12 4.2 2.5 2.5 0 0 1 16 6.5V9"/><path d="M12 9v11"/></>,
  usuario: <><circle cx="12" cy="8" r="3.5"/><path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6"/></>,
  sair: <><path d="M10 5H5v14h5M14 8l4 4-4 4M8 12h10"/></>,
  seta: <><path d="m15 18-6-6 6-6"/></>,
  coracao: <path d="M12 20S4 15.4 4 9.5A4.5 4.5 0 0 1 12 7a4.5 4.5 0 0 1 8 2.5C20 15.4 12 20 12 20Z"/>,
  caixa: <><path d="M4 8h16v12H4zM3 8l3-4h12l3 4M12 8v12M8 4l4 4 4-4"/></>,
  megafone: <><path d="M4 14V9l13-4v13zM7 14l1.5 5h3L10 14M17 9.5h3M18 6l1.5-1.5M18 17l1.5 1.5"/></>,
  alvo: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="M12 4V2M20 12h2"/></>,
  filtro: <path d="M4 5h16l-6 7v6l-4 2v-8z"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  relogio: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
}

export default function Icone({ nome, tamanho = 22 }) {
  return <svg className="icone" width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{caminhos[nome]}</svg>
}
