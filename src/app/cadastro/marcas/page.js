'use client'; 

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { Form, Button, Container, Row, Col, Card, Alert, Spinner, Modal } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa'; 
import Pagina from '@/app/components/Pagina';

export default function CadastrarMarca() {
  const [nome, setNome] = useState('');
  const [marcas, setMarcas] = useState([]); 
  const [usuarioMaster, setUsuarioMaster] = useState(null); 
  const [marcaSelecionada, setMarcaSelecionada] = useState(null); 
  const [modalConfirmacaoVisible, setModalConfirmacaoVisible] = useState(false); 
  const [marcaParaExcluir, setMarcaParaExcluir] = useState(null); 

  const router = useRouter(); 

  useEffect(() => {
    const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
    
    // Verifica se o usuário é o "master"
    if (usuarioLogado && usuarioLogado.usuario === 'master') {
      setUsuarioMaster(true); 
    } else {
      setUsuarioMaster(false); 
    }

    // Carrega as marcas do localStorage
    const marcasCadastradas = JSON.parse(localStorage.getItem('marcas')) || [];
    setMarcas(marcasCadastradas);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const marcasCadastradas = JSON.parse(localStorage.getItem('marcas')) || [];
    
    if (marcaSelecionada) {
      // Editar marca existente
      const marcaEditada = marcasCadastradas.map(marca => 
        marca.id === marcaSelecionada.id ? { ...marca, nome } : marca
      );
      localStorage.setItem('marcas', JSON.stringify(marcaEditada));
      setMarcas(marcaEditada);
      alert('Marca editada com sucesso!');
      setMarcaSelecionada(null); 
    } else {
      // Cadastrar nova marca
      const novaMarca = {
        id: marcasCadastradas.length + 1,
        nome,
      };

      marcasCadastradas.push(novaMarca);
      localStorage.setItem('marcas', JSON.stringify(marcasCadastradas));
      setMarcas(marcasCadastradas);
      alert('Marca cadastrada com sucesso!');
    }
    setNome(''); 
  };

  const editarMarca = (marca) => {
    setMarcaSelecionada(marca);
    setNome(marca.nome);
  };

  const handleShowModalConfirmacao = (id) => {
    setMarcaParaExcluir(id);
    setModalConfirmacaoVisible(true);
  };

  const handleCloseModalConfirmacao = () => {
    setModalConfirmacaoVisible(false);
    setMarcaParaExcluir(null);
  };

  const handleDeleteMarca = () => {
    const marcasCadastradas = JSON.parse(localStorage.getItem('marcas')) || [];
    const marcasFiltradas = marcasCadastradas.filter(marca => marca.id !== marcaParaExcluir);
    localStorage.setItem('marcas', JSON.stringify(marcasFiltradas));
    setMarcas(marcasFiltradas);
    handleCloseModalConfirmacao();
    alert('Marca excluída com sucesso!');
  };

  const limparFormulario = () => {
    setNome('');
    setMarcaSelecionada(null);
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
            <h2 className="text-center mb-4">Cadastrar Marca</h2>

            {usuarioMaster ? (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Nome da Marca</Form.Label>
                  <Form.Control 
                    type="text" 
                    value={nome} 
                    onChange={(e) => setNome(e.target.value)} 
                    required 
                    placeholder="Ex: Nike"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100 mb-2">
                  {marcaSelecionada ? 'Salvar Marca' : 'Cadastrar Marca'}
                </Button>
                <Button variant="secondary" onClick={limparFormulario} className="w-100">
                  Nova Marca
                </Button>
              </Form>
            ) : (
              <Alert variant="danger" className="text-center">
                Você não tem permissão para cadastrar marcas.
              </Alert>
            )}
          </Card>
        </Col>

        <Col md={6}>
        {usuarioMaster ? (
          <Card className="p-4 shadow-lg">
            <h2 className="text-center mb-4">Marcas Cadastradas</h2>
            <ul className="list-unstyled">
              {marcas.map((marca) => (
                <li key={marca.id} className="d-flex justify-content-between align-items-center mb-2">
                  <span onClick={() => editarMarca(marca)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                    {marca.nome}
                  </span>
                  <Button variant="link" onClick={() => handleShowModalConfirmacao(marca.id)} className="text-danger">
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
          <p>Confirmar exclusão da marca?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModalConfirmacao}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteMarca}>Confirmar</Button>
        </Modal.Footer>
      </Modal>
    </Container>
    </Pagina>
  );
}
