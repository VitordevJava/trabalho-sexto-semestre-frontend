import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './componentes/Layout'
import RotaProtegida from './componentes/RotaProtegida'

import LoginPage from './paginas/LoginPage'
import CadastroPage from './paginas/CadastroPage'
import HomePage from './paginas/HomePage'

import NecessidadesPublicasPage from './paginas/necessidades/NecessidadesPublicasPage'
import NecessidadeListaPage from './paginas/necessidades/NecessidadeListaPage'
import NecessidadeFormPage from './paginas/necessidades/NecessidadeFormPage'

import CategoriaListaPage from './paginas/categorias/CategoriaListaPage'
import CategoriaFormPage from './paginas/categorias/CategoriaFormPage'

/**
 * ====================================================================
 * MAPA DE ENDERECOS DO SITE.
 *
 * Cada frente adiciona as SUAS rotas na secao marcada com o seu nome.
 * NAO mexa nas rotas das outras frentes -> evita conflito de merge.
 *
 * Como funciona uma linha:
 *   <Route path="/campanhas" element={<CampanhaListaPage />} />
 *          ^ endereco no navegador     ^ componente que aparece
 *
 * Se a tela e so para administrador, embrulhe assim:
 *   element={<RotaProtegida somenteAdmin><MinhaTela /></RotaProtegida>}
 * ====================================================================
 */
export default function App() {
  return (
    <Layout>
      <Routes>

        {/* ---------- publico ---------- */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />
        <Route path="/necessidades" element={<NecessidadesPublicasPage />} />

        {/* ---------- administrativo: categorias (MOLDE) ---------- */}
        <Route path="/admin/categorias"
               element={<RotaProtegida somenteAdmin><CategoriaListaPage /></RotaProtegida>} />
        <Route path="/admin/categorias/nova"
               element={<RotaProtegida somenteAdmin><CategoriaFormPage /></RotaProtegida>} />
        <Route path="/admin/categorias/:id"
               element={<RotaProtegida somenteAdmin><CategoriaFormPage /></RotaProtegida>} />

        {/* ---------- administrativo: necessidades ---------- */}
        <Route path="/admin/necessidades"
               element={<RotaProtegida somenteAdmin><NecessidadeListaPage /></RotaProtegida>} />
        <Route path="/admin/necessidades/nova"
               element={<RotaProtegida somenteAdmin><NecessidadeFormPage /></RotaProtegida>} />
        <Route path="/admin/necessidades/:id"
               element={<RotaProtegida somenteAdmin><NecessidadeFormPage /></RotaProtegida>} />

        {/* ================= FRENTE 1 - DOACOES ================= */}
        {/* adicione suas rotas aqui */}

        {/* ================= FRENTE 2 - CAMPANHAS ================= */}
        {/* adicione suas rotas aqui */}

        {/* ================= FRENTE 3 - VOLUNTARIADO ================= */}
        {/* adicione suas rotas aqui */}

        {/* ================= FRENTE 4 - ACOES SOCIAIS ================= */}
        {/* adicione suas rotas aqui */}

        {/* endereco que nao existe volta para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
