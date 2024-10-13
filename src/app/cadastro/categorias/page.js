'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa'; 
import Pagina from '@/app/components/Pagina';

export default function CadastrarCategoria() {
  const [nome, setNome] = useState('');
  const [categorias, setCategorias] = useState([]); 
  const [usuarioMaster, setUsuarioMaster] = useState(null);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null); 
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false);
  const [categoriaParaExcluir, setCategoriaParaExcluir] = useState(null); 

  const router = useRouter();

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // Verifica se o usuário é o "master"
    if (usuarioLogado && usuarioLogado.usuario === 'master') {
      setUsuarioMaster(true); 
    } else {
      setUsuarioMaster(false); 
    }

    // Carrega as categorias do localStorage
    const categoriasCadastradas = JSON.parse(localStorage.getItem('categorias')) || [];
    setCategorias(categoriasCadastradas);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoriasCadastradas = JSON.parse(localStorage.getItem('categorias')) || [];
    
    if (categoriaSelecionada) {
      
      const categoriaEditada = categoriasCadastradas.map(categoria => 
        categoria.id === categoriaSelecionada.id ? { ...categoria, nome } : categoria
      );
      localStorage.setItem('categorias', JSON.stringify(categoriaEditada));
      setCategorias(categoriaEditada);
      alert('Categoria editada com sucesso!');
      setCategoriaSelecionada(null); 
    } else {
      
      const novaCategoria = {
        id: categoriasCadastradas.length + 1,
        nome,
      };

      categoriasCadastradas.push(novaCategoria);
      localStorage.setItem('categorias', JSON.stringify(categoriasCadastradas));
      setCategorias(categoriasCadastradas);
      alert('Categoria cadastrada com sucesso!');
    }
    setNome('');
  };

  const editarCategoria = (categoria) => {
    setCategoriaSelecionada(categoria);
    setNome(categoria.nome);
  };

  const handleShowModalConfirmacao = (id) => {
    setCategoriaParaExcluir(id);
    setModalConfirmacaoVisible(true);
  };

  const handleCloseModalConfirmacao = () => {
    setModalConfirmacaoVisible(false);
    setCategoriaParaExcluir(null);
  };

  const handleDeleteCategoria = () => {
    const categoriasCadastradas = JSON.parse(localStorage.getItem('categorias')) || [];
    const categoriasFiltradas = categoriasCadastradas.filter(categoria => categoria.id !== categoriaParaExcluir);
    localStorage.setItem('categorias', JSON.stringify(categoriasFiltradas));
    setCategorias(categoriasFiltradas);
    handleCloseModalConfirmacao();
    alert('Categoria excluída com sucesso!');
  };

  const limparFormulario = () => {
    setNome('');
    setCategoriaSelecionada(null);
  };

  if (usuarioMaster === null) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Verificando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Pagina>
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="p-4 shadow-lg">
            <h2 className="text-center mb-4">Cadastrar Categoria</h2>

            {usuarioMaster ? (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Categoria</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                    required 
                    placeholder="Ex: Roupas"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-2">
                  {categoriaSelecionada ? 'Salvar Categoria' : 'Cadastrar Categoria'}
                </Button>
                <Button variant="secondary" onClick={limparFormulario} className="w-100">
                  Nova Categoria
                </Button>
              </Form>
            ) : (
              <Alert variant="danger" className="text-center">
                Você não tem permissão para cadastrar categorias.
              </Alert>
            )}
          </Card>
        </Col>

        <Col md={6}>
        {usuarioMaster ? (
          <Card className="p-4 shadow-lg">
            <h2 className="text-center mb-4">Categorias Cadastradas</h2>
            <ul className="list-unstyled">
              {categorias.map((categoria) => (
                <li key={categoria.id} className="d-flex justify-content-between align-items-center mb-2">
                  <span onClick={() => editarCategoria(categoria)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                    {categoria.nome}
                  </span>
                  <Button variant="link" onClick={() => handleShowModalConfirmacao(categoria.id)} className="text-danger">
                    <FaTrash />
                  </Button>
                </li>
              ))}
            </ul>
          </Card>
          ) : (
            <p></p>
          )}
        </Col>
      </Row>

      {/* Modal de confirmação de exclusão */}
      <Modal show={modalConfirmacaoVisible} onHide={handleCloseModalConfirmacao}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Exclusão</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Confirmar exclusão da categoria?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalConfirmacao}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteCategoria}>Confirmar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </Pagina>
  );
}
